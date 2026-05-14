"""
Unit tests for the portfolio chat backend.

Scope: the deterministic Python logic — gates, fuzzy matching, prompt builder,
and chat-endpoint routing. The LLM itself is mocked; we test that our code
calls (or skips) it correctly, not that Groq works.

Run from repo root:
    cd backend && source venv/bin/activate && pytest -q
"""

import os

# Set a dummy key before importing main so ChatGroq's constructor doesn't object.
# The LLM is mocked in tests, no real call is ever made.
os.environ.setdefault("GROQ_API_KEY", "test-key-not-used")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from langchain_core.runnables import RunnableLambda  # noqa: E402
from langchain_core.messages import AIMessage  # noqa: E402

import main  # noqa: E402
from main import (  # noqa: E402
    _squash,
    _trigger_hits_message,
    _match_takes,
    _fallback_takes,
    _select_takes,
    build_system_prompt_for,
    app,
    SECRET_CODE,
    FALLBACK_TAKE_TOPICS,
)


# Fixtures

@pytest.fixture
def mock_llms(monkeypatch):
    """Swap both LLMs for a deterministic RunnableLambda so tests never hit Groq."""
    fake = RunnableLambda(lambda _: AIMessage(content="MOCK_LLM_RESPONSE"))
    monkeypatch.setattr(main, "llm", fake)
    monkeypatch.setattr(main, "normalizer_llm", fake)
    return fake


@pytest.fixture
def client(mock_llms):
    """FastAPI TestClient with both LLMs already mocked."""
    return TestClient(app)


# _squash

@pytest.mark.parametrize(
    "raw, expected",
    [
        ("spoorss", "spors"),    # collapses doubled chars
        ("ploooooz", "ploz"),    # collapses long runs
        ("sports", "sports"),    # idempotent on clean input
        ("SPORTS", "sports"),    # lowercases as it collapses
        ("", ""),                # empty input does not crash
    ],
)
def test_squash(raw, expected):
    """_squash collapses consecutive repeated chars and lowercases the result."""
    assert _squash(raw) == expected


# _trigger_hits_message

def test_trigger_strict_substring_hits():
    """An exact substring of the trigger inside the message is the cheapest match."""
    msg = "what sports does ayaan play"
    assert _trigger_hits_message("sports", msg, _squash(msg))


def test_trigger_case_insensitive():
    """Both the trigger and the message are lowercased before comparison."""
    msg = "WHAT SPORTS DOES AYAAN PLAY"
    assert _trigger_hits_message("Sports", msg, _squash(msg))


def test_trigger_misses_unrelated_topic():
    """An unrelated message does not produce a fuzzy false-positive."""
    msg = "tell me about projects"
    assert not _trigger_hits_message("sports", msg, _squash(msg))


def test_trigger_empty_returns_false():
    """An empty trigger never matches — guards against blank YAML entries."""
    assert not _trigger_hits_message("", "anything", "anything")


def test_trigger_short_string_skips_fuzzy():
    """Triggers below MIN_FUZZY_TRIGGER_LEN match strictly, never fuzzily."""
    # 'job' (3 chars) — strict substring hits.
    msg_with = "what is his job?"
    assert _trigger_hits_message("job", msg_with, _squash(msg_with))
    # Strict miss — no fuzzy fallback because trigger is below the cutoff.
    msg_without = "tell me everything please"
    assert not _trigger_hits_message("job", msg_without, _squash(msg_without))


def test_long_multiword_trigger_does_not_fuzzy_false_positive():
    """The >2-word guard stops generic filler from fuzzy-matching long triggers."""
    msg = "tell me about him"
    assert not _trigger_hits_message("tell me about your projects", msg, _squash(msg))


def test_long_multiword_trigger_still_matches_strict_substring():
    """Long triggers still hit on strict substring even when fuzzy is skipped."""
    msg = "could you tell me about your projects please"
    assert _trigger_hits_message("tell me about your projects", msg, _squash(msg))


def test_fuzzy_catches_single_char_typo():
    """partial_ratio handles edit-distance-1 typos like 'spors' → 'sports'."""
    msg = "what spors does ayaan plys"
    assert _trigger_hits_message("sports", msg, _squash(msg))


def test_fuzzy_catches_double_letter_typo_via_squash():
    """squash() pre-processing rescues double-letter typos like 'spoorss'."""
    msg = "what spoorss does ayaan plyz"
    assert _trigger_hits_message("sports", msg, _squash(msg))


# _match_takes

def test_match_takes_projects():
    """A clean 'projects' query routes to the projects signature take."""
    topics = [t.get("topic") for t in _match_takes("what are your projects?")]
    assert "projects" in topics


def test_match_takes_sports_with_typo():
    """A typo'd sports query still routes to the sports take via fuzzy match."""
    topics = [t.get("topic") for t in _match_takes("what spors does ayaan plys")]
    assert "sports and athletics" in topics


def test_match_takes_returns_empty_on_unrelated():
    """A gibberish query produces no take matches — caller can fall back."""
    assert _match_takes("xyzqwerty mystery zzzz") == []


def test_match_takes_deduplicates_within_same_take():
    """Multiple trigger hits inside one take should only yield that take once."""
    matched = _match_takes("projects projects projects portfolio")
    topic_counts = {}
    for t in matched:
        topic_counts[t.get("topic")] = topic_counts.get(t.get("topic"), 0) + 1
    assert topic_counts.get("projects") == 1


def test_match_takes_returns_multiple_topics():
    """A query touching two topics yields both takes (no first-match-wins)."""
    matched = _match_takes("tell me about your projects and your experience at experian")
    topics = [t.get("topic") for t in matched]
    assert "projects" in topics
    assert "professional experience at Experian" in topics


# _fallback_takes

def test_fallback_returns_configured_topics_in_order():
    """The fallback set matches FALLBACK_TAKE_TOPICS exactly, in declared order."""
    topics = [t.get("topic") for t in _fallback_takes()]
    assert topics == FALLBACK_TAKE_TOPICS


def test_fallback_handles_missing_topic(monkeypatch):
    """Fallback topics that don't exist in the YAML are skipped, not crashed on."""
    monkeypatch.setattr(main, "FALLBACK_TAKE_TOPICS", ["nonexistent topic xyz"])
    assert _fallback_takes() == []


# _select_takes

def test_select_takes_fuzzy_path(monkeypatch):
    """Clean keyword goes through the fuzzy path; normalizer is never called."""
    monkeypatch.setattr(main, "_normalize_via_llm", lambda s: None)
    takes, path = _select_takes("what are your projects?")
    assert path == "fuzzy"
    assert "projects" in [t.get("topic") for t in takes]


def test_select_takes_fallback_path(monkeypatch):
    """Unmatchable query (after normalizer no-op) falls through to fallback."""
    monkeypatch.setattr(main, "_normalize_via_llm", lambda s: None)
    takes, path = _select_takes("hi there")
    assert path == "fallback"
    assert [t.get("topic") for t in takes] == FALLBACK_TAKE_TOPICS


def test_select_takes_normalized_path(monkeypatch):
    """Fuzzy fails, normalizer cleans the text, fuzzy matches → label 'normalized'."""
    monkeypatch.setattr(main, "_normalize_via_llm", lambda s: "projects")
    takes, path = _select_takes("zzqqrr xxyy mystery")
    assert path == "normalized"
    assert "projects" in [t.get("topic") for t in takes]


def test_select_takes_normalizer_failure_drops_to_fallback(monkeypatch):
    """If the normalizer returns None (rate-limit, network), we use fallback."""
    monkeypatch.setattr(main, "_normalize_via_llm", lambda s: None)
    takes, path = _select_takes("zzqqrr xxyy mystery")
    assert path == "fallback"


# build_system_prompt_for

def test_build_prompt_default_includes_static_personal_info():
    """Static personal-info section is always present regardless of which take fired."""
    text, _ = build_system_prompt_for("hi", mode="default")
    assert "Ayaan Izhar" in text


def test_build_prompt_default_has_private_block_not_unlock():
    """Default mode shows the gate text and never leaks the unlocked context."""
    text, _ = build_system_prompt_for("hi", mode="default")
    assert "PRIVATE TOPICS (DO NOT DISCUSS):" in text
    assert "UNLOCKED PRIVATE CONTEXT" not in text


def test_build_prompt_unlocked_swaps_private_for_unlock_block():
    """Unlocked mode swaps the gate text for the secret-context block."""
    text, path = build_system_prompt_for("wuava love life", mode="unlocked")
    assert path == "unlocked"
    assert "UNLOCKED PRIVATE CONTEXT" in text
    assert "DO NOT DISCUSS" not in text


def test_build_prompt_fuzzy_match_includes_topic_marker():
    """A fuzzy-matched take's topic label appears in the rendered prompt."""
    text, path = build_system_prompt_for("what are your projects?", mode="default")
    assert path == "fuzzy"
    assert "TOPIC: projects" in text


def test_build_prompt_does_not_leak_triggers():
    """TRIGGERS lines were dropped from the rendered prompt — Python does that match."""
    text, _ = build_system_prompt_for("what are your projects?", mode="default")
    assert "TRIGGERS:" not in text


# Chat endpoint integration (LLM mocked)

def test_health_endpoint(client):
    """/api/health returns 200 with the expected service tag."""
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_personal_keyword_gate_short_circuits_llm(client):
    """Personal-life questions return the gatekeeper without ever calling the LLM."""
    r = client.post("/api/chat", json={"message": "does he have a girlfriend?", "history": []})
    assert r.status_code == 200
    body = r.json()
    assert "code words" in body["response"].lower()
    # If the LLM had been called the mock would have returned MOCK_LLM_RESPONSE.
    assert "MOCK_LLM_RESPONSE" not in body["response"]


def test_personal_keyword_gate_is_case_insensitive(client):
    """Uppercase personal-keyword queries still fire the gate."""
    r = client.post("/api/chat", json={"message": "WHO IS WUAVEE?", "history": []})
    assert r.status_code == 200
    assert "code words" in r.json()["response"].lower()


def test_code_phrase_unlock_invokes_llm(client):
    """The unlock phrase routes through the LLM (mock) instead of the gate."""
    r = client.post("/api/chat", json={"message": "wuava love life", "history": []})
    assert r.status_code == 200
    assert r.json()["response"] == "MOCK_LLM_RESPONSE"


def test_normal_message_invokes_llm(client):
    """Ordinary questions take the default LLM path."""
    r = client.post("/api/chat", json={"message": "what are your projects?", "history": []})
    assert r.status_code == 200
    assert r.json()["response"] == "MOCK_LLM_RESPONSE"


def test_code_phrase_runs_before_personal_keyword_gate(client):
    """Order matters: code-phrase check wins over personal-keyword gate."""
    r = client.post("/api/chat", json={
        "message": "wuava love life — does he have a girlfriend?",
        "history": [],
    })
    assert r.status_code == 200
    assert r.json()["response"] == "MOCK_LLM_RESPONSE"


@pytest.mark.parametrize(
    "payload, reason",
    [
        ({"history": []},                                                          "missing 'message' field"),
        ({"message": "", "history": []},                                           "empty message rejected by min_length=1"),
        ({"message": "x" * 2001, "history": []},                                   "oversized message rejected by max_length=2000"),
        ({"message": "hi", "history": [{"role": "user", "content": "hi"}] * 21},   "oversized history rejected by max_length=20"),
        ({"message": "hi", "history": [{"role": "system", "content": "x"}]},       "bad role rejected by Literal['user','assistant']"),
    ],
    ids=[
        "missing_message",
        "empty_message",
        "oversized_message",
        "oversized_history",
        "bad_role",
    ],
)
def test_request_validation_rejects_invalid_payload(client, payload, reason):
    """Pydantic rejects every malformed chat request with 422 before reaching the handler."""
    r = client.post("/api/chat", json=payload)
    assert r.status_code == 422, f"expected 422 ({reason}), got {r.status_code}"


def test_suggestions_endpoint(client):
    """/api/suggestions returns a non-empty list of starter questions."""
    r = client.get("/api/suggestions")
    assert r.status_code == 200
    assert isinstance(r.json().get("questions"), list)


def test_health_works_without_llm_initialization(monkeypatch):
    """Lazy LLM init: /api/health succeeds even when both LLMs are uninitialized."""
    monkeypatch.setattr(main, "llm", None)
    monkeypatch.setattr(main, "normalizer_llm", None)
    called = {"main": False, "normalizer": False}

    def _fail_main():
        called["main"] = True
        raise RuntimeError("main LLM should not be initialized for /api/health")

    def _fail_norm():
        called["normalizer"] = True
        raise RuntimeError("normalizer LLM should not be initialized for /api/health")

    monkeypatch.setattr(main, "_get_llm", _fail_main)
    monkeypatch.setattr(main, "_get_normalizer_llm", _fail_norm)

    r = TestClient(app).get("/api/health")
    assert r.status_code == 200
    assert called == {"main": False, "normalizer": False}


def test_get_llm_returns_patched_instance_when_set(monkeypatch):
    """Lazy getter short-circuits when main.llm is already monkey-patched."""
    sentinel = RunnableLambda(lambda _: AIMessage(content="SENTINEL"))
    monkeypatch.setattr(main, "llm", sentinel)
    assert main._get_llm() is sentinel


# Knowledge base sanity

def test_secret_code_question_locked_to_known_phrase():
    """If the unlock phrase changes, the chat handler's gate logic needs revisiting."""
    assert SECRET_CODE.get("Question", "").lower().strip() == "wuava love life"


def test_secret_code_has_gatekeeper_response():
    """The gatekeeper string must be non-empty — chat handler depends on it."""
    assert SECRET_CODE.get("gatekeeper_response", "").strip() != ""


def test_secret_code_has_personal_keywords():
    """Personal-keyword list must include the core gated terms."""
    keywords = SECRET_CODE.get("personal_keywords", [])
    assert len(keywords) > 0
    lowered = {k.lower() for k in keywords}
    for required in ("wuavee", "girlfriend", "love life"):
        assert required in lowered, f"missing required personal keyword: {required}"
