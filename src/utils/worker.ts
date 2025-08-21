import type {
  ModelMainEvent,
  ModelWorkerEvent,
} from "@/constants/event";

export const makeMessage = <T = any>(msg: {
  type: ModelMainEvent | ModelWorkerEvent;
  data?: T;
}) => {
  return msg;
};
