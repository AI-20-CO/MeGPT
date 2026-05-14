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
    """Replace both LLMs with a deterministic Runnable so tests never hit Groq.

    RunnableLambda is a real LangChain Runnable, so the `prompt | llm` pipe
    composes correctly and `.invoke()` returns our fixed AIMessage.
    """
    fake = RunnableLambda(lambda _: AIMessage(content="MOCK_LLM_RESPONSE"))
    monkeypatch.setattr(main, "llm", fake)
    monkeypatch.setattr(main, "normalizer_llm", fake)
    return fake


@pytest.fixture
def client(mock_llms):
    return TestClient(app)


# _squash

def test_squash_collapses_doubled_chars():
    assert _squash("spoorss") == "spors"


def test_squash_collapses_long_runs():
    assert _squash("ploooooz") == "ploz"


def test_squash_idempotent_on_clean_input():
    assert _squash("sports") == "sports"


def test_squash_lowercases():
    assert _squash("SPORTS") == "sports"


def test_squash_handles_empty():
    assert _squash("") == ""


# _trigger_hits_message

def test_trigger_strict_substring_hits():
    msg = "what sports does ayaan play"
    assert _trigger_hits_message("sports", msg, _squash(msg))


def test_trigger_case_insensitive():
    msg = "WHAT SPORTS DOES AYAAN PLAY"
    assert _trigger_hits_message("Sports", msg, _squash(msg))


def test_trigger_misses_unrelated_topic():
    msg = "tell me about projects"
    assert not _trigger_hits_message("sports", msg, _squash(msg))


def test_trigger_empty_returns_false():
    assert not _trigger_hits_message("", "anything", "anything")


def test_trigger_short_string_skips_fuzzy():
    """Triggers below MIN_FUZZY_TRIGGER_LEN only match on strict substring,
    so they don't false-positive on common letter clusters."""
    # 'job' (3 chars) — strict substring hits
    msg_with = "what is his job?"
    assert _trigger_hits_message("job", msg_with, _squash(msg_with))
    # Strict miss — no fuzzy fallback because trigger is below the cutoff
    msg_without = "tell me everything please"
    assert not _trigger_hits_message("job", msg_without, _squash(msg_without))


def test_long_multiword_trigger_does_not_fuzzy_false_positive():
    """The whole reason the 2-word-max rule exists: 'tell me about your projects'
    must not fuzzy-match 'tell me about him' just because the prefix overlaps."""
    msg = "tell me about him"
    assert not _trigger_hits_message("tell me about your projects", msg, _squash(msg))


def test_long_multiword_trigger_still_matches_strict_substring():
    msg = "could you tell me about your projects please"
    assert _trigger_hits_message("tell me about your projects", msg, _squash(msg))


def test_fuzzy_catches_single_char_typo():
    """'sports' against 'spors' is edit distance 1 — partial_ratio handles it."""
    msg = "what spors does ayaan plys"
    assert _trigger_hits_message("sports", msg, _squash(msg))


def test_fuzzy_catches_double_letter_typo_via_squash():
    """'spoorss' squashes to 'spors', which partial_ratio matches against 'sports'."""
    msg = "what spoorss does ayaan plyz"
    assert _trigger_hits_message("sports", msg, _squash(msg))


# _match_takes

def test_match_takes_projects():
    topics = [t.get("topic") for t in _match_takes("what are your projects?")]
    assert "projects" in topics


def test_match_takes_sports_with_typo():
    topics = [t.get("topic") for t in _match_takes("what spors does ayaan plys")]
    assert "sports and athletics" in topics


def test_match_takes_returns_empty_on_unrelated():
    assert _match_takes("xyzqwerty mystery zzzz") == []


def test_match_takes_deduplicates_within_same_take():
    """Multiple trigger hits inside one take should still return that take once."""
    matched = _match_takes("projects projects projects portfolio")
    topic_counts = {}
    for t in matched:
        topic_counts[t.get("topic")] = topic_counts.get(t.get("topic"), 0) + 1
    assert topic_counts.get("projects") == 1


def test_match_takes_returns_multiple_topics():
    matched = _match_takes("tell me about your projects and your experience at experian")
    topics = [t.get("topic") for t in matched]
    assert "projects" in topics
    assert "professional experience at Experian" in topics


# _fallback_takes

def test_fallback_returns_configured_topics_in_order():
    topics = [t.get("topic") for t in _fallback_takes()]
    assert topics == FALLBACK_TAKE_TOPICS


def test_fallback_handles_missing_topic(monkeypatch):
    """Fallback topics that don't exist in the YAML should be skipped, not crash."""
    monkeypatch.setattr(main, "FALLBACK_TAKE_TOPICS", ["nonexistent topic xyz"])
    assert _fallback_takes() == []


# _select_takes

def test_select_takes_fuzzy_path(monkeypatch):
    """Clean keyword query goes to the fuzzy path with no normalizer call."""
    monkeypatch.setattr(main, "_normalize_via_llm", lambda s: None)
    takes, path = _select_takes("what are your projects?")
    assert path == "fuzzy"
    assert "projects" in [t.get("topic") for t in takes]


def test_select_takes_fallback_path(monkeypatch):
    """Unmatchable query falls through to the fallback set."""
    monkeypatch.setattr(main, "_normalize_via_llm", lambda s: None)
    takes, path = _select_takes("hi there")
    assert path == "fallback"
    assert [t.get("topic") for t in takes] == FALLBACK_TAKE_TOPICS


def test_select_takes_normalized_path(monkeypatch):
    """When fuzzy fails on the raw message but the normalizer produces text
    that fuzzy CAN match, the path label is 'normalized'."""
    # Raw message is gibberish; normalizer returns the keyword 'projects'.
    monkeypatch.setattr(main, "_normalize_via_llm", lambda s: "projects")
    takes, path = _select_takes("zzqqrr xxyy mystery")
    assert path == "normalized"
    assert "projects" in [t.get("topic") for t in takes]


def test_select_takes_normalizer_failure_drops_to_fallback(monkeypatch):
    """If the normalizer call fails (returns None), we get the fallback set."""
    monkeypatch.setattr(main, "_normalize_via_llm", lambda s: None)
    takes, path = _select_takes("zzqqrr xxyy mystery")
    assert path == "fallback"


# build_system_prompt_for

def test_build_prompt_default_includes_static_personal_info():
    text, _ = build_system_prompt_for("hi", mode="default")
    assert "Ayaan Izhar" in text


def test_build_prompt_default_has_private_block_not_unlock():
    text, _ = build_system_prompt_for("hi", mode="default")
    assert "PRIVATE TOPICS (DO NOT DISCUSS):" in text
    assert "UNLOCKED PRIVATE CONTEXT" not in text


def test_build_prompt_unlocked_swaps_private_for_unlock_block():
    text, path = build_system_prompt_for("wuava love life", mode="unlocked")
    assert path == "unlocked"
    assert "UNLOCKED PRIVATE CONTEXT" in text
    assert "DO NOT DISCUSS" not in text


def test_build_prompt_fuzzy_match_includes_topic_marker():
    text, path = build_system_prompt_for("what are your projects?", mode="default")
    assert path == "fuzzy"
    assert "TOPIC: projects" in text


def test_build_prompt_does_not_leak_triggers():
    """Triggers were removed from the rendered prompt — Python does that matching
    now. Including them would waste tokens."""
    text, _ = build_system_prompt_for("what are your projects?", mode="default")
    assert "TRIGGERS:" not in text


# Chat endpoint integration (LLM mocked)

def test_health_endpoint(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_personal_keyword_gate_short_circuits_llm(client):
    """Personal-life questions must return the gatekeeper string without calling
    the LLM. Critical security boundary."""
    r = client.post("/api/chat", json={"message": "does he have a girlfriend?", "history": []})
    assert r.status_code == 200
    body = r.json()
    # The gatekeeper string is exact and deterministic
    assert "code words" in body["response"].lower()
    # If the LLM had been called, the mock would have returned MOCK_LLM_RESPONSE
    assert "MOCK_LLM_RESPONSE" not in body["response"]


def test_personal_keyword_gate_is_case_insensitive(client):
    r = client.post("/api/chat", json={"message": "WHO IS WUAVEE?", "history": []})
    assert r.status_code == 200
    assert "code words" in r.json()["response"].lower()


def test_code_phrase_unlock_invokes_llm(client):
    r = client.post("/api/chat", json={"message": "wuava love life", "history": []})
    assert r.status_code == 200
    assert r.json()["response"] == "MOCK_LLM_RESPONSE"


def test_normal_message_invokes_llm(client):
    r = client.post("/api/chat", json={"message": "what are your projects?", "history": []})
    assert r.status_code == 200
    assert r.json()["response"] == "MOCK_LLM_RESPONSE"


def test_code_phrase_runs_before_personal_keyword_gate(client):
    """Both 'wuava love life' (code phrase) and 'girlfriend' (personal keyword)
    appear in the message. Code-phrase check is first in the handler, so the
    LLM (unlock path) should fire — not the gatekeeper."""
    r = client.post("/api/chat", json={
        "message": "wuava love life — does he have a girlfriend?",
        "history": [],
    })
    assert r.status_code == 200
    assert r.json()["response"] == "MOCK_LLM_RESPONSE"


def test_request_validation_rejects_missing_message(client):
    """Pydantic should reject a body without the required 'message' field."""
    r = client.post("/api/chat", json={"history": []})
    assert r.status_code == 422


def test_request_validation_rejects_empty_message(client):
    """min_length=1 must block empty strings."""
    r = client.post("/api/chat", json={"message": "", "history": []})
    assert r.status_code == 422


def test_request_validation_rejects_oversized_message(client):
    """max_length=2000 must block payload-bomb messages."""
    r = client.post("/api/chat", json={"message": "x" * 2001, "history": []})
    assert r.status_code == 422


def test_request_validation_rejects_oversized_history(client):
    """max_length=20 on history must block client-side spam."""
    big_history = [{"role": "user", "content": "hi"}] * 21
    r = client.post("/api/chat", json={"message": "hi", "history": big_history})
    assert r.status_code == 422


def test_request_validation_rejects_bad_role(client):
    """Literal['user','assistant'] must reject other strings."""
    r = client.post(
        "/api/chat",
        json={"message": "hi", "history": [{"role": "system", "content": "x"}]},
    )
    assert r.status_code == 422


def test_suggestions_endpoint(client):
    r = client.get("/api/suggestions")
    assert r.status_code == 200
    assert isinstance(r.json().get("questions"), list)


# Knowledge base sanity

def test_secret_code_question_locked_to_known_phrase():
    """If this changes, the chat handler's gate logic needs revisiting too."""
    assert SECRET_CODE.get("Question", "").lower().strip() == "wuava love life"


def test_secret_code_has_gatekeeper_response():
    assert SECRET_CODE.get("gatekeeper_response", "").strip() != ""


def test_secret_code_has_personal_keywords():
    keywords = SECRET_CODE.get("personal_keywords", [])
    assert len(keywords) > 0
    # Sanity: a few representative keywords must be present
    lowered = {k.lower() for k in keywords}
    for required in ("wuavee", "girlfriend", "love life"):
        assert required in lowered, f"missing required personal keyword: {required}"
