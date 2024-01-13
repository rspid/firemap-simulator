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

export async function POST(request: Request) {
  const res = await request.json();
  const sensor = res.sensor;
  const oneSensor = await db.sensor.findUnique({
    where: {
      id: sensor,
    },
  });
  if (!oneSensor) return;

  const sensorUpdated = await db.sensor.update({
    where: {
      id: oneSensor.id,
    },
    data: {
      events: {
        create: [{ event: { create: { is_over: false } } }],
      },
    },
    include: {
      events: {
        include: {
          event: {
            include: {
              sensors: {
                include: {
                  sensor: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const latestEvent =
    sensorUpdated.events[sensorUpdated.events.length - 1].event;

  const { id, is_over, created_at, sensors } = latestEvent;

  return Response.json({ id, is_over, created_at, sensors });
}
