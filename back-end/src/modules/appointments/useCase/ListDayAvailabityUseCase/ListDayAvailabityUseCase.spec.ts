import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryAppointmentRepository } from "@modules/appointments/repositories/in-memory/inMemoryAppointmentsRepository";
import { ListProvaiderDayAvailabilitysUseCase } from "./ListDayAvailabityUseCase";

let inMemoryAppointmentsRepository: InMemoryAppointmentRepository;
let sut: ListProvaiderDayAvailabilitysUseCase;

describe("List Provaiders Day Availability", () => {
  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentRepository();
    sut = new ListProvaiderDayAvailabilitysUseCase(
      inMemoryAppointmentsRepository
    );
  });

  it("should be able to list providers the day availability from provaider", async () => {
    await inMemoryAppointmentsRepository.createAppointmnetUser({
      provider_id: "provaider",
      user_id: "user-id-teste-01",
      date: new Date(2023, 10, 22, 14, 0, 0) /* 22/10/2023 14:00 */,
    });

    await inMemoryAppointmentsRepository.createAppointmnetUser({
      provider_id: "provaider",
      user_id: "user-id-teste-01",
      date: new Date(2023, 10, 22, 15, 0, 0) /* 22/10/2023 15:00 */,
    });

    vi.spyOn(Date, "now").mockImplementation(() => {
      return new Date(2023, 10, 22, 11).getTime();
    });

    const availability = await sut.execute({
      provider_id: "provaider",
      month: 11,
      year: 2023,
      day: 22,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true }
      ])
    );
  });
});
