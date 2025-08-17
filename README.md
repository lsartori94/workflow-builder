# Workflow builder

Simple workflow creator UI

## Features
- Workflow creation supporting the following node types:
  - Start Node
    - Single entry point.
  - Decision Node
    - A branching gate with a tiny condition (e.g., `score >= 700` or `doc.type == 'passport'`). **0–2** outgoing edges.
  - Step Node
    - A simple operation with one outgoing edge. Renameable; tiny optional key/value config (e.g., **Fetch Data Point** or **Constant**).
  - End Node
    - Terminal node
- Light / Dark mode selection
- Import / Export of JSON data

## How to start app?
- Run `npm run dev`
- Navigate to `http://localhost:5173`

## Sample to import
```
{
  "nodes": [
    {
      "id": "start-1755389761142-txzes55x4",
      "type": "start",
      "position": {
        "x": 220.2542624792851,
        "y": 246.25032470450537
      },
      "data": {
        "label": "Start",
        "config": {}
      }
    },
    {
      "id": "decision-1755389783211-1pd2rcr1y",
      "type": "decision",
      "position": {
        "x": 508.4933652256867,
        "y": 230.72426994130996
      },
      "data": {
        "label": "Decision",
        "config": {
          "condition": ""
        }
      }
    },
    {
      "id": "step-1755389799985-rr6je70cv",
      "type": "step",
      "position": {
        "x": 353.6065844434878,
        "y": 241.0331130803491
      },
      "data": {
        "label": "Step",
        "config": {
          "key": "some",
          "value": "key"
        }
      }
    },
    {
      "id": "step-1755389823622-xoy627bw9",
      "type": "step",
      "position": {
        "x": 634.4915343055802,
        "y": 142.56932568790518
      },
      "data": {
        "label": "Step",
        "config": {
          "key": "",
          "value": ""
        }
      }
    },
    {
      "id": "end-1755389826938-gapts3i74",
      "type": "end",
      "position": {
        "x": 759.344996669615,
        "y": 242.95698189635544
      },
      "data": {
        "label": "End",
        "config": {}
      }
    }
  ],
  "edges": [
    {
      "id": "start-1755389761142-txzes55x4-step-1755389799985-rr6je70cv",
      "source": "start-1755389761142-txzes55x4",
      "target": "step-1755389799985-rr6je70cv"
    },
    {
      "id": "step-1755389799985-rr6je70cv-decision-1755389783211-1pd2rcr1y",
      "source": "step-1755389799985-rr6je70cv",
      "target": "decision-1755389783211-1pd2rcr1y"
    },
    {
      "id": "step-1755389823622-xoy627bw9-end-1755389826938-gapts3i74",
      "source": "step-1755389823622-xoy627bw9",
      "target": "end-1755389826938-gapts3i74"
    },
    {
      "id": "decision-1755389783211-1pd2rcr1y-end-1755389826938-gapts3i74",
      "source": "decision-1755389783211-1pd2rcr1y",
      "target": "end-1755389826938-gapts3i74",
      "label": "no",
      "sourceHandle": "no"
    },
    {
      "id": "decision-1755389783211-1pd2rcr1y-step-1755389823622-xoy627bw9",
      "source": "decision-1755389783211-1pd2rcr1y",
      "target": "step-1755389823622-xoy627bw9",
      "label": "yes",
      "sourceHandle": "yes"
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "createdAt": "2025-08-17T00:17:24.156Z",
    "updatedAt": "2025-08-17T00:17:24.156Z",
    "name": "Untitled Workflow",
    "description": "Created with Workflow Builder"
  }
}
```
