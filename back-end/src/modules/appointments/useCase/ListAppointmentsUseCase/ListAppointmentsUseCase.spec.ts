import { InMemoryAppointmentRepository } from "@modules/appointments/repositories/in-memory/inMemoryAppointmentsRepository";
import { beforeEach, describe, expect, it } from "vitest";
import { ListAppointmentsUseCase } from "./ListAppointmentsUseCase";
import CreateAppointmentsUseCase from "../CreateAppointmentsUseCase/CreateAppointmentsUseCase";
import { inMemoryNotificationRepository } from "@modules/notifications/repositories/in-memory/inMemoryNotificationRepository";
import FakeCacheProvider from "@providers/CacheProvaider/fakes/fakeCacheProvider";

let inMemoryAppointmentRepository: InMemoryAppointmentRepository;
let inMemoryNotificationsRepository: inMemoryNotificationRepository
let fakeCacheProvider: FakeCacheProvider
let sut: ListAppointmentsUseCase;

describe("List Appointments Use Case", () => {
  beforeEach(() => {
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository();
    inMemoryNotificationsRepository = new inMemoryNotificationRepository()
    fakeCacheProvider = new FakeCacheProvider()
    sut = new ListAppointmentsUseCase(inMemoryAppointmentRepository);
  });

  it("Should be able to list  appointments", async () => {
    const createAppointemntUsecase = new CreateAppointmentsUseCase(
      inMemoryAppointmentRepository, inMemoryNotificationsRepository, fakeCacheProvider
    );

    await createAppointemntUsecase.execute({
      provider_id: "provider-id-teste-01",
      user_id: "user-id-teste-01",
      date: new Date(2024, 10, 22, 8, 0, 0),
    });

    await createAppointemntUsecase.execute({
      provider_id: "provider-id-teste-02",
      user_id: "user-id-teste-02",
      date: new Date(2024, 10, 22, 9, 0, 0),
    });

    await createAppointemntUsecase.execute({
      provider_id: "provider-id-teste-03",
      user_id: "user-id-teste-03",
      date: new Date(2024, 10, 22, 10, 0, 0),
    });

    const appointements = await sut.execute();

    expect(appointements).toHaveLength(3);
  });

  it("Should not be able to create two appointment on the same time", async () => { });
});
