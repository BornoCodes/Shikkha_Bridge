from typing import List, Dict, Any

class GapAnalyzer:
    @staticmethod
    def analyze(absences: List[Dict[str, Any]], syllabus_topics: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes absence events, maps them against scheduled syllabus topics,
        calculates gap severity, and identifies dependency chains.
        """
        gaps = []
        total_missed_hours = 0
        severity_counts = {"high": 0, "medium": 0, "low": 0}

        topic_map = {t.get("id"): t for t in syllabus_topics}

        for abs_event in absences:
            missed_topic_ids = abs_event.get("topic_ids", [])
            reason = abs_event.get("reason", "unspecified")
            duration_days = abs_event.get("duration_days", 1)

            for tid in missed_topic_ids:
                topic = topic_map.get(tid, {
                    "id": tid,
                    "name": f"Module {tid}",
                    "weight": 1.0,
                    "prerequisites": []
                })

                # Gap severity logic
                weight = topic.get("weight", 1.0)
                if duration_days > 3 or weight > 1.5:
                    severity = "high"
                elif duration_days > 1 or weight >= 1.0:
                    severity = "medium"
                else:
                    severity = "low"

                severity_counts[severity] += 1
                est_catchup_time = round(duration_days * 2.5 * weight, 1)
                total_missed_hours += est_catchup_time

                gaps.append({
                    "topic_id": topic["id"],
                    "topic_name": topic.get("name", "Unknown Topic"),
                    "subject": topic.get("subject", "General Studies"),
                    "absence_reason": reason,
                    "date": abs_event.get("date"),
                    "severity": severity,
                    "estimated_catchup_hours": est_catchup_time,
                    "prerequisites": topic.get("prerequisites", [])
                })

        return {
            "total_gaps": len(gaps),
            "severity_summary": severity_counts,
            "total_estimated_catchup_hours": total_missed_hours,
            "detected_gaps": gaps
        }

gap_analyzer = GapAnalyzer()
