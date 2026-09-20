import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetSampleData, updateSettings } from "@/store/postSlice";
import { TIMEZONES, type Settings } from "@/lib/types";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PostFlow" },
      {
        name: "description",
        content:
          "Choose your default calendar view, time zone, week start day, notifications and reset demo data.",
      },
      { property: "og:title", content: "Settings — PostFlow" },
      {
        property: "og:description",
        content: "Default view, time zone, week start and notification preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

const VIEW_LABELS: Record<Settings["defaultView"], string> = {
  dayGridMonth: "Month",
  timeGridWeek: "Week",
  timeGridDay: "Day",
  listWeek: "Agenda",
};

function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((s) => s.posts.settings);

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Preferences are saved on this device straight away.
        </p>
      </header>

      <section className="border-border bg-card space-y-5 rounded-xl border p-5">
        <div className="grid gap-2">
          <Label htmlFor="defaultView">Default calendar view</Label>
          <Select
            value={settings.defaultView}
            onValueChange={(v) =>
              dispatch(updateSettings({ defaultView: v as Settings["defaultView"] }))
            }
          >
            <SelectTrigger id="defaultView">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(VIEW_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tz">Time zone preference</Label>
          <Select
            value={settings.timezone}
            onValueChange={(v) => dispatch(updateSettings({ timezone: v }))}
          >
            <SelectTrigger id="tz">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="weekStart">Week starts on</Label>
          <Select
            value={String(settings.weekStart)}
            onValueChange={(v) => dispatch(updateSettings({ weekStart: Number(v) as 0 | 1 }))}
          >
            <SelectTrigger id="weekStart">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sunday</SelectItem>
              <SelectItem value="1">Monday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-border flex items-center justify-between gap-4 border-t pt-4">
          <div className="min-w-0">
            <Label htmlFor="notify">Notifications</Label>
            <p className="text-muted-foreground mt-1 text-xs">
              Get a nudge before a scheduled post goes out.
            </p>
          </div>
          <Switch
            id="notify"
            checked={settings.notifications}
            onCheckedChange={(checked) => dispatch(updateSettings({ notifications: checked }))}
          />
        </div>
      </section>

      <section className="border-border bg-card rounded-xl border p-5">
        <h2 className="font-display text-base font-semibold">Sample data</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Restore the original demo posts. Anything you created will be replaced.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            dispatch(resetSampleData());
            toast.success("Sample data restored.");
          }}
        >
          <RotateCcw size={15} /> Reset sample data
        </Button>
      </section>
    </div>
  );
}
