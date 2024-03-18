import { InMemoryAppointmentRepository } from "@modules/appointments/repositories/in-memory/inMemoryAppointmentsRepository";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ListProviderAppointmentsUseCase from "./ListProvaiderAppointmentsUseCase";
import FakeCacheProvider from "@providers/CacheProvaider/fakes/fakeCacheProvider";

let inMemoryAppointmentsRepository: InMemoryAppointmentRepository;
let fakeCacheProvider: FakeCacheProvider
let sut: ListProviderAppointmentsUseCase;

describe("ListProviderAppointmentsService", () => {
  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentRepository();
    fakeCacheProvider = new FakeCacheProvider()
    sut = new ListProviderAppointmentsUseCase(inMemoryAppointmentsRepository, fakeCacheProvider);

    vi.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 18, 12).getTime();
    });
  });

  it("should be able to list appointments of a provider on a specific day", async () => {
    const iterable = Array.from({ length: 2 }, (_, index) => index + 13);

    const appointments = await Promise.all(
      iterable.map(async (item) =>
        inMemoryAppointmentsRepository.createAppointmnetUser({
          provider_id: "provider-id",
          user_id: "user-id",
          date: new Date(2020, 4, 18, item, 0, 0),
        })
      )
    );

    const availability = await sut.execute({
      provider_id: "provider-id",
      day: 18,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual([...appointments]);
  });
});
