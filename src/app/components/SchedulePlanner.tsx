import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileDown,
  Plus,
  Trash2,
} from "lucide-react";

const STORAGE_KEY = "axon-study-schedules-v1";

export interface ScheduleDay {
  day: number;
  dateIso: string;
  dateLabel: string;
  cardsToStudy: number;
  startCard: number;
  endCard: number;
  completed: boolean;
}

export interface StudyScheduleRecord {
  id: string;
  totalCards: number;
  targetDateIso: string;
  days: ScheduleDay[];
  expanded: boolean;
  createdAt: string;
}

interface SchedulePlannerProps {
  /** Prefills the "total cards" field when creating a new schedule */
  suggestedTotalCards?: number;
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseDateInput(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

function buildStudyPlan(totalCards: number, targetDateIso: string): ScheduleDay[] {
  const today = startOfLocalDay(new Date());
  const end = startOfLocalDay(parseDateInput(targetDateIso));
  const msDay = 86_400_000;
  const studyDays = Math.floor((end.getTime() - today.getTime()) / msDay) + 1;

  if (studyDays < 1 || totalCards < 1) return [];

  const cardsPerDay = Math.ceil(totalCards / studyDays);
  const plan: ScheduleDay[] = [];

  for (let i = 0; i < studyDays; i++) {
    const startCard = i * cardsPerDay + 1;
    const endCard = Math.min((i + 1) * cardsPerDay, totalCards);
    if (startCard > totalCards) break;

    const date = new Date(today);
    date.setDate(date.getDate() + i);

    plan.push({
      day: i + 1,
      dateIso: toIsoDate(date),
      dateLabel: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      cardsToStudy: endCard - startCard + 1,
      startCard,
      endCard,
      completed: false,
    });
  }

  return plan;
}

function planStats(days: ScheduleDay[], totalCards: number) {
  const n = days.length;
  if (n === 0) {
    return {
      studyDays: 0,
      avgPerDay: 0,
      minDay: 0,
      maxDay: 0,
      firstLabel: "",
      lastLabel: "",
    };
  }
  const counts = days.map((d) => d.cardsToStudy);
  const minDay = Math.min(...counts);
  const maxDay = Math.max(...counts);
  const avgPerDay = Math.round((totalCards / n) * 10) / 10;
  return {
    studyDays: n,
    avgPerDay,
    minDay,
    maxDay,
    firstLabel: days[0]?.dateLabel ?? "",
    lastLabel: days[n - 1]?.dateLabel ?? "",
  };
}

function loadSchedules(): StudyScheduleRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (s): s is StudyScheduleRecord =>
        typeof s === "object" &&
        s !== null &&
        typeof (s as StudyScheduleRecord).id === "string" &&
        Array.isArray((s as StudyScheduleRecord).days)
    );
  } catch {
    return [];
  }
}

function saveSchedules(list: StudyScheduleRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* quota or private mode */
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function openPrintableSchedule(schedule: StudyScheduleRecord) {
  const stats = planStats(schedule.days, schedule.totalCards);
  const rows = schedule.days
    .map(
      (d) =>
        `<tr>
          <td>${d.day}</td>
          <td>${escapeHtml(d.dateLabel)}</td>
          <td>${d.startCard}–${d.endCard}</td>
          <td>${d.cardsToStudy}</td>
          <td>${d.completed ? "Done" : "—"}</td>
        </tr>`
    )
    .join("");

  const w = window.open("", "_blank");
  if (!w) return;

  const title = `Study schedule · ${schedule.totalCards} cards by ${schedule.targetDateIso}`;
  w.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
    h1 { font-size: 1.25rem; margin-bottom: 8px; }
    .meta { font-size: 0.875rem; color: #444; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; }
    th { background: #f4f4f5; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  <h1>AXON — Study plan</h1>
  <div class="meta">
    <div><strong>Total cards:</strong> ${schedule.totalCards}</div>
    <div><strong>Target date:</strong> ${escapeHtml(schedule.targetDateIso)}</div>
    <div><strong>Study days:</strong> ${stats.studyDays}</div>
    <div><strong>Avg cards / day:</strong> ${stats.avgPerDay}</div>
    <div><strong>Daily range:</strong> ${stats.minDay}–${stats.maxDay} cards</div>
    <div><strong>Range:</strong> ${escapeHtml(stats.firstLabel)} → ${escapeHtml(stats.lastLabel)}</div>
  </div>
  <table>
    <thead><tr><th>Day</th><th>Date</th><th>Card range</th><th>Count</th><th>Done</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="margin-top:16px;font-size:12px;color:#666;">Use your browser print dialog and choose &quot;Save as PDF&quot; if you want a PDF file.</p>
</body>
</html>`);
  w.document.close();
  w.focus();
  requestAnimationFrame(() => {
    w.print();
  });
}

export function SchedulePlanner({ suggestedTotalCards }: SchedulePlannerProps) {
  const [schedules, setSchedules] = useState<StudyScheduleRecord[]>(() => loadSchedules());
  const [totalCardsInput, setTotalCardsInput] = useState(
    () => (suggestedTotalCards != null && suggestedTotalCards > 0 ? String(suggestedTotalCards) : "")
  );
  const [targetDate, setTargetDate] = useState("");

  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);

  useEffect(() => {
    setTotalCardsInput((prev) =>
      suggestedTotalCards != null && suggestedTotalCards > 0 && prev === ""
        ? String(suggestedTotalCards)
        : prev
    );
  }, [suggestedTotalCards]);

  const todayIso = useMemo(() => toIsoDate(startOfLocalDay(new Date())), []);

  const addSchedule = useCallback(() => {
    const totalCards = Math.max(0, parseInt(totalCardsInput, 10) || 0);
    if (!targetDate || totalCards < 1) return;

    const end = startOfLocalDay(parseDateInput(targetDate));
    const today = startOfLocalDay(new Date());
    if (end < today) {
      window.alert("Please choose a target completion date that is today or later.");
      return;
    }

    const days = buildStudyPlan(totalCards, targetDate);
    if (days.length === 0) {
      window.alert("Could not build a schedule for those values.");
      return;
    }

    const record: StudyScheduleRecord = {
      id: crypto.randomUUID(),
      totalCards,
      targetDateIso: targetDate,
      days,
      expanded: true,
      createdAt: new Date().toISOString(),
    };

    setSchedules((prev) => [record, ...prev]);
  }, [totalCardsInput, targetDate]);

  const toggleExpanded = useCallback((id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s))
    );
  }, []);

  const deleteSchedule = useCallback((id: string, e: MouseEvent) => {
    e.stopPropagation();
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const savePdf = useCallback((schedule: StudyScheduleRecord, e: MouseEvent) => {
    e.stopPropagation();
    openPrintableSchedule(schedule);
  }, []);

  const toggleDayComplete = useCallback((scheduleId: string, dayNumber: number) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id !== scheduleId) return s;
        return {
          ...s,
          days: s.days.map((d) =>
            d.day === dayNumber ? { ...d, completed: !d.completed } : d
          ),
        };
      })
    );
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            New study schedule
          </CardTitle>
          <p className="text-sm text-gray-600">
            Add one or more Anki-style review plans. Progress is saved in this browser even when you switch tabs.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-total-cards">Total cards to review</Label>
              <Input
                id="schedule-total-cards"
                type="number"
                min={1}
                inputMode="numeric"
                placeholder="e.g. 500"
                value={totalCardsInput}
                onChange={(e) => setTotalCardsInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-target-date">Target completion date</Label>
              <Input
                id="schedule-target-date"
                type="date"
                min={todayIso}
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={addSchedule}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!targetDate || !(parseInt(totalCardsInput, 10) >= 1)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new schedule
          </Button>
        </CardContent>
      </Card>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-gray-600">
            No schedules yet. Enter your card count and target date, then tap <strong>Add new schedule</strong>.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => {
            const stats = planStats(schedule.days, schedule.totalCards);
            const doneCount = schedule.days.filter((d) => d.completed).length;

            return (
              <Card key={schedule.id} className="overflow-hidden border-gray-200 shadow-sm">
                <CardHeader
                  role="button"
                  tabIndex={0}
                  aria-expanded={schedule.expanded}
                  className="cursor-pointer select-none bg-gradient-to-r from-slate-50 to-blue-50/80 hover:from-slate-100 hover:to-blue-50 transition-colors py-4"
                  onClick={() => toggleExpanded(schedule.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpanded(schedule.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-w-0">
                      {schedule.expanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg leading-snug">
                          {schedule.totalCards} cards by {schedule.targetDateIso}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {stats.studyDays} study days · ~{stats.avgPerDay} cards/day · range{" "}
                          {stats.minDay}–{stats.maxDay}/day · {doneCount}/{schedule.days.length} days
                          checked
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={(e) => savePdf(schedule, e)}
                        title="Save as PDF (opens print — choose Save as PDF)"
                      >
                        <FileDown className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">PDF</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={(e) => deleteSchedule(schedule.id, e)}
                      >
                        <Trash2 className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {schedule.expanded && (
                  <CardContent className="space-y-6 pt-2">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="font-semibold text-sm text-blue-900 mb-3">Study plan overview</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <div className="text-gray-600 text-xs uppercase tracking-wide">Total cards</div>
                          <div className="font-semibold text-lg">{schedule.totalCards}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-xs uppercase tracking-wide">Study days</div>
                          <div className="font-semibold text-lg">{stats.studyDays}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-xs uppercase tracking-wide">Avg / day</div>
                          <div className="font-semibold text-lg">{stats.avgPerDay}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-xs uppercase tracking-wide">Daily range</div>
                          <div className="font-semibold text-lg">
                            {stats.minDay}–{stats.maxDay} cards
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-3">
                        Calendar span: {stats.firstLabel} → {stats.lastLabel}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-3 text-gray-800">Daily schedule</h3>
                      <p className="text-xs text-gray-500 mb-3">
                        Tap a row to mark that day complete. Your checkmarks are saved automatically.
                      </p>
                      <div className="space-y-2">
                        {schedule.days.map((day) => (
                          <button
                            key={day.day}
                            type="button"
                            onClick={() => toggleDayComplete(schedule.id, day.day)}
                            className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                              day.completed
                                ? "bg-green-50 border-green-300"
                                : "bg-white border-gray-200 hover:border-blue-300 active:scale-[0.99]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex flex-col items-center shrink-0">
                                  <Badge variant={day.completed ? "default" : "outline"}>Day {day.day}</Badge>
                                  <span className="text-xs text-gray-500 mt-1">{day.dateLabel}</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-sm">
                                    Cards {day.startCard} – {day.endCard}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {day.cardsToStudy} cards to review
                                  </div>
                                </div>
                              </div>
                              {day.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" aria-hidden />
                              ) : (
                                <div
                                  className="w-6 h-6 border-2 border-gray-300 rounded-full shrink-0"
                                  aria-hidden
                                />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
