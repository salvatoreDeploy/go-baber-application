import { InMemoryAppointmentRepository } from "@modules/appointments/repositories/in-memory/inMemoryAppointmentsRepository";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateAppointmentsUseCase from "./CreateAppointmentsUseCase";
import { AppError } from "@shared/error/AppError";
import { inMemoryNotificationRepository } from "@modules/notifications/repositories/in-memory/inMemoryNotificationRepository";
import FakeCacheProvider from "@providers/CacheProvaider/fakes/fakeCacheProvider";

let inMemoryAppointmentRepository: InMemoryAppointmentRepository;
let inMemoryNotificationsRepository: inMemoryNotificationRepository
let fakeCacheProvider: FakeCacheProvider
let sut: CreateAppointmentsUseCase;

describe("Create Appointments Use Case", () => {
  beforeEach(() => {
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository();
    inMemoryNotificationsRepository = new inMemoryNotificationRepository()
    fakeCacheProvider = new FakeCacheProvider()
    sut = new CreateAppointmentsUseCase(inMemoryAppointmentRepository, inMemoryNotificationsRepository, fakeCacheProvider);
  });

  it("Should be able to create new appointment", async () => {
    vi.spyOn(Date, "now").mockImplementation(() => {
      return new Date(2023, 10, 28, 10).getTime();
    });

    const appointment = await sut.execute({
      provider_id: "provider-id-teste-01",
      user_id: "user-id-teste-01",
      date: new Date(2023, 10, 28, 13),
    });

    expect(appointment.id).toEqual(expect.any(String));
    expect(appointment).toHaveProperty("provider_id");
    expect(appointment).toHaveProperty("date");
    expect(appointment).toEqual(
      expect.objectContaining({ provider_id: "provider-id-teste-01" })
    );
  });

  it("Should not be able to create two appointment on the same time", async () => {
    vi.setSystemTime(new Date(2022, 0, 3, 2, 0, 0));

    await sut.execute({
      provider_id: "provider-id-teste-01",
      user_id: "user-id-teste-01",
      date: new Date(2022, 0, 3, 9, 0, 0),
    });

    await expect(() =>
      sut.execute({
        provider_id: "provider-id-teste-01",
        user_id: "user-id-teste-01",
        date: new Date(2022, 0, 3, 9, 0, 0),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create an appointment on a past date", async () => {
    vi.spyOn(Date, "now").mockImplementation(() => {
      return new Date(2023, 10, 28, 10).getTime();
    });

    await expect(() =>
      sut.execute({
        provider_id: "provider-id-teste-01",
        user_id: "user-id-teste-01",
        date: new Date(2023, 10, 28, 9),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create an appointment with same user as provaider", async () => {
    vi.spyOn(Date, "now").mockImplementation(() => {
      return new Date(2023, 10, 28, 10).getTime();
    });

    await expect(() =>
      sut.execute({
        provider_id: "provider-id-teste-01",
        user_id: "provider-id-teste-01",
        date: new Date(2023, 10, 28, 15),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create an appointment before 8am and after 8pm", async () => {
    vi.spyOn(Date, "now").mockImplementation(() => {
      return new Date(2023, 10, 28, 10).getTime();
    });

    await expect(() =>
      sut.execute({
        provider_id: "provider-id-teste-01",
        user_id: "user-id-teste-01",
        date: new Date(2023, 10, 29, 7),
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(() =>
      sut.execute({
        provider_id: "provider-id-teste-01",
        user_id: "user-id-teste-01",
        date: new Date(2023, 10, 29, 18),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
