import { beforeEach, describe, expect, it, test, vi } from "vitest";
import { ListProvaiderMonthAvailabilitysUseCase } from "./ListProvaiderMonthAvailabilityUseCase";
import { InMemoryAppointmentRepository } from "@modules/appointments/repositories/in-memory/inMemoryAppointmentsRepository";
import { getHours } from "date-fns";

let inMemoryAppointmentsRepository: InMemoryAppointmentRepository;
let sut: ListProvaiderMonthAvailabilitysUseCase;

describe("List Provaiders Month Availability", () => {
  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentRepository();
    sut = new ListProvaiderMonthAvailabilitysUseCase(
      inMemoryAppointmentsRepository
    );
  });

  it("should be able to list providers the month availability from provaider", async () => {
    const teste = [];

    let date = new Date(2023, 10, 22, 5, 0, 0);

    for (let i = 0; i < 10; i++) {
      let hour = getHours(date);
      date.setHours(hour + 1);

      const value = await inMemoryAppointmentsRepository.create({
        provider_id: "provaider",
        user_id: "user-id-teste-01",
        date: new Date(2023, 10, 22, hour, 0, 0) /* 22/10/2023 8:00 */,
      });

      teste.push(value);
    }

    // console.log(teste);

    await inMemoryAppointmentsRepository.create({
      provider_id: "provaider",
      user_id: "user-id-teste-01",
      date: new Date(2023, 10, 23, 9, 0, 0) /* 23/12/2023 9:00 */,
    });

    const availability = await sut.execute({
      provider_id: "provaider",
      month: 11,
      year: 2023,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 2, available: false },
        { day: 3, available: false },
        { day: 4, available: false },
        { day: 5, available: false },
        { day: 6, available: false },
        { day: 7, available: false },
        { day: 8, available: false },
        { day: 9, available: false },
        { day: 10, available: false },
        { day: 11, available: false },
        { day: 12, available: false },
        { day: 13, available: false },
        { day: 14, available: false },
        { day: 15, available: false },
        { day: 16, available: false },
        { day: 17, available: false },
        { day: 18, available: false },
        { day: 19, available: false },
        { day: 20, available: false },
        { day: 21, available: false },
        { day: 22, available: false },
        { day: 23, available: false },
        { day: 24, available: false },
        { day: 25, available: false },
        { day: 26, available: false },
        { day: 27, available: false },
        { day: 28, available: false },
        { day: 29, available: false },
        { day: 30, available: false }
      ])
    );
  });
});
