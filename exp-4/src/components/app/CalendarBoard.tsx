import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  EventDropArg,
} from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { reschedulePost, setCalendarView } from "@/store/postSlice";
import { filterPosts } from "@/lib/post-utils";
import { PLATFORM_STYLES, type Post, type Settings } from "@/lib/types";
import { usePostDialogs } from "./PostDialogs";

const VIEWS: { id: Settings["defaultView"]; label: string }[] = [
  { id: "dayGridMonth", label: "Month" },
  { id: "timeGridWeek", label: "Week" },
  { id: "timeGridDay", label: "Day" },
  { id: "listWeek", label: "Agenda" },
];

const DEFAULT_DURATION_MS = 30 * 60_000;

/** Keep wall-clock time when FullCalendar converts a timed event to all-day (month drops). */
function resolveDropRange(arg: EventDropArg): { start: Date; end: Date } | null {
  const rawStart = arg.event.start;
  if (!rawStart) return null;

  const oldStart = arg.oldEvent.start;
  const oldEnd = arg.oldEvent.end;
  const oldDurationMs =
    oldStart && oldEnd ? oldEnd.getTime() - oldStart.getTime() : DEFAULT_DURATION_MS;

  if (arg.event.allDay && oldStart) {
    const start = new Date(rawStart);
    start.setHours(
      oldStart.getHours(),
      oldStart.getMinutes(),
      oldStart.getSeconds(),
      oldStart.getMilliseconds(),
    );
    return { start, end: new Date(start.getTime() + oldDurationMs) };
  }

  const end = arg.event.end ?? new Date(rawStart.getTime() + oldDurationMs);
  return { start: rawStart, end };
}

export function CalendarBoard() {
  const dispatch = useAppDispatch();
  const { openView, openCreate } = usePostDialogs();
  const posts = useAppSelector((s) => s.posts.posts);
  const filters = useAppSelector((s) => s.posts.filters);
  const view = useAppSelector((s) => s.posts.calendarView);
  const settings = useAppSelector((s) => s.posts.settings);
  const hydrated = useAppSelector((s) => s.posts.hydrated);
  const ref = useRef<FullCalendar | null>(null);
  const [title, setTitle] = useState("");

  const events = useMemo(
    () =>
      filterPosts(posts, filters).map((p) => ({
        id: p.id,
        title: p.title,
        start: p.start,
        end: p.end,
        platform: p.platform,
        status: p.status,
        extendedProps: { post: p, platform: p.platform, status: p.status },
      })),
    [posts, filters],
  );

  useEffect(() => {
    const calendar = ref.current?.getApi();
    if (!calendar) return;
    if (calendar.view.type !== view) calendar.changeView(view);
  }, [view]);

  if (!hydrated) {
    return (
      <div
        className="border-border bg-card h-[min(78vh,840px)] animate-pulse rounded-xl border"
        aria-hidden
      />
    );
  }

  const api = () => ref.current?.getApi();

  const syncTitle = () => setTitle(api()?.view.title ?? "");

  const commitReschedule = (id: string, start: Date, end: Date, message: string) => {
    dispatch(
      reschedulePost({
        id,
        start: start.toISOString(),
        end: end.toISOString(),
      }),
    );
    toast.success(message);
  };

  const handleEventDrop = (arg: EventDropArg) => {
    const range = resolveDropRange(arg);
    if (!range) {
      arg.revert();
      return;
    }

    // Month view may mark the event all-day; restore timed range so Redux keeps the clock time.
    if (arg.event.allDay) {
      arg.event.setAllDay(false);
      arg.event.setDates(range.start, range.end);
    }

    commitReschedule(arg.event.id, range.start, range.end, "Post rescheduled successfully.");
  };

  const handleEventResize = (arg: EventResizeDoneArg) => {
    const start = arg.event.start;
    const end = arg.event.end;
    if (!start || !end) {
      arg.revert();
      return;
    }
    commitReschedule(arg.event.id, start, end, "Post rescheduled successfully.");
  };

  const handleEventClick = (arg: EventClickArg) => {
    const post = arg.event.extendedProps["post"] as Post | undefined;
    if (post) openView(post);
  };

  const handleDateClick = (date: Date) => openCreate(date);

  const handleSelect = (arg: DateSelectArg) => {
    openCreate(arg.start);
    arg.view.calendar.unselect();
  };

  return (
    <div className="border-border bg-card flex min-h-[min(78vh,840px)] flex-col space-y-3 rounded-xl border p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            aria-label="Previous"
            onClick={() => {
              api()?.prev();
              syncTitle();
            }}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              api()?.today();
              syncTitle();
            }}
          >
            Today
          </Button>
          <h2 className="font-display mx-1 min-w-0 flex-1 truncate text-center text-base font-semibold sm:mx-3 sm:flex-none sm:text-left sm:text-lg">
            {title}
          </h2>
          <Button
            variant="outline"
            size="sm"
            aria-label="Next"
            onClick={() => {
              api()?.next();
              syncTitle();
            }}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </Button>
        </div>

        <div className="border-border bg-muted flex flex-wrap gap-1 rounded-lg border p-1">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => dispatch(setCalendarView(v.id))}
              aria-pressed={view === v.id}
              className={cn(
                "focus-visible:ring-ring rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                view === v.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="fc-board min-h-0 flex-1">
        <FullCalendar
          ref={ref}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={view}
          initialDate={new Date("2026-09-19T00:00:00")}
          firstDay={settings.weekStart}
          headerToolbar={false}
          height="100%"
          expandRows
          nowIndicator
          editable
          eventStartEditable
          eventDurationEditable
          eventResizableFromStart
          droppable={false}
          dayMaxEvents={3}
          moreLinkClick="popover"
          selectable
          selectMirror
          slotMinTime="06:00:00"
          slotMaxTime="24:00:00"
          slotDuration="00:30:00"
          snapDuration="00:15:00"
          allDaySlot={false}
          forceEventDuration
          events={events}
          eventContent={renderEvent}
          datesSet={(arg) => setTitle(arg.view.title)}
          dateClick={(arg) => handleDateClick(arg.date)}
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          noEventsContent="No scheduled posts found"
        />
      </div>
    </div>
  );
}

function renderEvent(arg: EventContentArg) {
  const post = arg.event.extendedProps["post"] as Post;
  const style = PLATFORM_STYLES[post.platform];
  const isTimeGrid = arg.view.type.startsWith("timeGrid");

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-0.5 rounded-md px-1.5 py-1 text-[11px] leading-tight",
        isTimeGrid && "h-full",
      )}
      style={{
        backgroundColor: `color-mix(in oklab, ${style.hex} 16%, transparent)`,
        borderLeft: `3px solid ${style.hex}`,
        opacity: post.status === "Draft" ? 0.75 : 1,
      }}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: style.hex }}
          aria-hidden
        />
        <span className="text-foreground truncate font-semibold">{post.platform}</span>
        {arg.timeText ? (
          <span className="text-muted-foreground ml-auto hidden shrink-0 sm:inline">
            {arg.timeText}
          </span>
        ) : null}
      </div>
      <span className="text-foreground/90 truncate font-medium">{post.title}</span>
    </div>
  );
}
