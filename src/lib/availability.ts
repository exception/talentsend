import { z } from "zod";
import { DateTime } from "luxon";

const Time = z.object({
  hour: z.number(),
  minute: z.number(),
});

const TimeSlot = z
  .object({
    start: Time,
    end: Time,
  })
  .refine(
    (data) => {
      const startInMinutes = data.start.hour * 60 + data.start.minute;
      const endInMinutes = data.end.hour * 60 + data.end.minute;

      return endInMinutes > startInMinutes;
    },
    {
      message: "End time must be larger than start time.",
      path: ["end"],
    },
  );

export const DayAvailabilty = z.object({
  day: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  available: z.boolean(),
  slots: TimeSlot.array(),
});

export type Day = z.infer<typeof DayAvailabilty>["day"];
export type DayAvailability = z.infer<typeof DayAvailabilty>;
export type TimeSlot = z.infer<typeof TimeSlot>;
export type Time = z.infer<typeof Time>;

export const isUserAvailable = (
  availability: DayAvailability[],
  timezone: string,
): boolean => {
  // Create a current DateTime in the specified timezone
  const currentTimeInZone = DateTime.now().setZone(timezone);

  // In case timezone is invalid, return false
  if (!currentTimeInZone.isValid) {
    console.error(`Invalid timezone: ${timezone}`);
    return false;
  }

  const currentDay = currentTimeInZone.weekdayLong;

  const todayAvailability = availability.find((av) => av.day === currentDay?.toUpperCase());
  // If today's availability isn't provided or user isn't marked as available, return false
  if (!todayAvailability || !todayAvailability.available) return false;

  for (const slot of todayAvailability.slots) {
    const startTime = currentTimeInZone.set({
      hour: slot.start.hour,
      minute: slot.start.minute,
      second: 0,
      millisecond: 0,
    });
    const endTime = currentTimeInZone.set({
      hour: slot.end.hour,
      minute: slot.end.minute,
      second: 0,
      millisecond: 0,
    });

    // Check if current time is within the time slot
    if (currentTimeInZone >= startTime && currentTimeInZone <= endTime) {
      return true;
    }
  }

  return false;
};
