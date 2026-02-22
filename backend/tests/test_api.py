from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_analyze_endpoint(client: TestClient):
    # Depending on model load time, this might take a few seconds
    # we expect text analysis format to be correct.
    response = client.post("/api/v1/analyze", json={"text": "I love this product but it completely broke my computer!"})
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "is_fake" in data
    assert "credibility_score" in data

    # Quick heuristic check (may vary slightly by model)
    # usually neutral or negative
    assert data["sentiment"] in ["positive", "neutral", "negative"]
