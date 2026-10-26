"""Read-only demo-data API. No academic rules or personal data processing."""
from __future__ import annotations

import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

DATA_FILE = Path(__file__).resolve().parent / "data" / "demo.json"
app = FastAPI(title="Graduation Path — Demo API", version="1.0.0")
# Read-only, non-sensitive demo JSON is served to a separately deployed frontend.
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET"], allow_headers=["*"])


def load_demo() -> dict:
    with DATA_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def packet(value: object) -> dict:
    return {"demo": True, "disclaimer": load_demo()["meta"]["institutionDisclaimer"], "data": value}


@app.get("/", include_in_schema=False)
def root():
    return {"name": "Graduation Path Demo API", "demo": True, "docs": "/docs"}


@app.get("/api/health")
def health():
    return {"ok": True, "demo": True, "service": "fastapi"}


@app.get("/api/demo")
def get_demo():
    return packet(load_demo())


@app.get("/api/student")
def student():
    return packet(load_demo()["student"])


@app.get("/api/requirements")
def requirements():
    return packet(load_demo()["requirements"])


@app.get("/api/courses")
def courses():
    return packet(load_demo()["catalog"])


@app.get("/api/analysis")
def analysis():
    return packet(load_demo()["scenarios"])


@app.get("/api/analysis/{scenario_id}")
def analysis_by_id(scenario_id: str):
    result = next((x for x in load_demo()["scenarios"] if x["id"] == scenario_id), None)
    if result is None:
        raise HTTPException(status_code=404, detail="Unknown demo scenario")
    return packet(result)


@app.get("/api/roadmap")
def roadmap():
    return packet(load_demo()["roadmaps"])


@app.get("/api/roadmap/{scenario_id}")
def roadmap_by_id(scenario_id: str):
    result = load_demo()["roadmaps"].get(scenario_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Unknown demo scenario")
    return packet(result)
