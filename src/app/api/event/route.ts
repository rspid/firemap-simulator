import { db } from "@/server/db";

//for java simulator
//update sensors intensity
export async function PUT(request: Request) {
  const res = await request.json();
  const sensors = res.sensors;
  const result = await Promise.all(
    sensors.map(async (sensor: { id: number; intensity: number }) => {
      const oneSensor = await db.sensor.update({
        where: {
          id: sensor.id,
        },
        data: {
          intensity: sensor.intensity,
        },
        include: {
          events: true,
        },
      });
      if (!oneSensor) return;
      if (oneSensor.intensity === 0) {
        oneSensor.events.map((event) => {
          db.event.update({
            where: {
              id: event.event_id,
            },
            data: {
              is_over: true,
            },
          });
        });
      }
      return oneSensor;
    })
  );
  return Response.json({ result });
}
