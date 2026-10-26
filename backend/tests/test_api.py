"""API smoke tests: run from backend/ with pytest."""
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)


def test_api_endpoints():
    for path in ["/api/health", "/api/demo", "/api/student", "/api/requirements", "/api/courses", "/api/analysis", "/api/roadmap"]:
        response = client.get(path)
        assert response.status_code == 200, path
        assert response.json().get("demo") is True


def test_scenario_endpoints():
    for scenario in ["partial", "course", "complete"]:
        assert client.get(f"/api/analysis/{scenario}").status_code == 200
        assert client.get(f"/api/roadmap/{scenario}").status_code == 200
    assert client.get("/api/analysis/unknown").status_code == 404
    assert client.get("/api/roadmap/unknown").status_code == 404


def test_no_fake_calculation():
    assert client.get("/api/demo").json()["data"]["meta"]["demo"] is True
