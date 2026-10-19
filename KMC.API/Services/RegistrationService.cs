using KMC.API.DTOs;
using KMC.API.Models;
using KMC.API.Repositories;

namespace KMC.API.Services
{
    public interface IRegistrationService
    {
        Task<RegistrationResponseDto> RegisterAsync(int eventId, int participantId);
        Task<bool> CancelRegistrationAsync(int registrationId, int participantId);
        Task<IEnumerable<RegistrationResponseDto>> GetMyRegistrationsAsync(int participantId);
        Task<IEnumerable<ParticipantResponseDto>> GetEventParticipantsAsync(int eventId, int organizerId);
    }

    public class RegistrationService : IRegistrationService
    {
        private readonly IRegistrationRepository _registrationRepository;
        private readonly IEventRepository _eventRepository;

        public RegistrationService(IRegistrationRepository registrationRepository, IEventRepository eventRepository)
        {
            _registrationRepository = registrationRepository;
            _eventRepository = eventRepository;
        }

        public async Task<RegistrationResponseDto> RegisterAsync(int eventId, int participantId)
        {
            var ev = await _eventRepository.GetByIdWithDetailsAsync(eventId);
            if (ev == null)
            {
                throw new KeyNotFoundException($"Event with Id {eventId} was not found.");
            }

            // Rule 3: Registration must close after the event starts
            if (DateTime.UtcNow >= ev.StartDate)
            {
                throw new InvalidOperationException("Registration has closed because the event has already started.");
            }

            // Rule 1: Participants cannot register twice
            var existingReg = await _registrationRepository.GetByParticipantAndEventAsync(participantId, eventId);
            if (existingReg != null)
            {
                if (existingReg.Status == "Registered")
                {
                    throw new InvalidOperationException("You are already registered for this event.");
                }
                else
                {
                    // Re-activate registration if previously cancelled
                    existingReg.Status = "Registered";
                    existingReg.RegistrationDate = DateTime.UtcNow;
                    _registrationRepository.Update(existingReg);
                    await _registrationRepository.SaveChangesAsync();
                    return MapToResponseDto(existingReg);
                }
            }

            // Rule 2: Maximum participant limit cannot be exceeded
            var activeCount = await _registrationRepository.GetActiveCountForEventAsync(eventId);
            if (activeCount >= ev.MaxParticipants)
            {
                throw new InvalidOperationException("Registration is full for this event. Maximum participant limit reached.");
            }

            var registration = new Registration
            {
                EventId = eventId,
                ParticipantId = participantId,
                RegistrationDate = DateTime.UtcNow,
                Status = "Registered"
            };

            await _registrationRepository.AddAsync(registration);
            await _registrationRepository.SaveChangesAsync();

            // Reload registration with navigation properties
            var createdReg = (await _registrationRepository.GetByParticipantIdAsync(participantId))
                .FirstOrDefault(r => r.Id == registration.Id);

            return MapToResponseDto(createdReg ?? registration);
        }

        public async Task<bool> CancelRegistrationAsync(int registrationId, int participantId)
        {
            var registration = await _registrationRepository.GetByIdAsync(registrationId);
            if (registration == null)
            {
                throw new KeyNotFoundException($"Registration with Id {registrationId} was not found.");
            }

            if (registration.ParticipantId != participantId)
            {
                throw new UnauthorizedAccessException("You are not authorized to cancel this registration.");
            }

            registration.Status = "Cancelled";
            _registrationRepository.Update(registration);
            return await _registrationRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<RegistrationResponseDto>> GetMyRegistrationsAsync(int participantId)
        {
            var registrations = await _registrationRepository.GetByParticipantIdAsync(participantId);
            return registrations.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<ParticipantResponseDto>> GetEventParticipantsAsync(int eventId, int organizerId)
        {
            var ev = await _eventRepository.GetByIdAsync(eventId);
            if (ev == null)
            {
                throw new KeyNotFoundException($"Event with Id {eventId} was not found.");
            }

            if (ev.OrganizerId != organizerId)
            {
                throw new UnauthorizedAccessException("You are not authorized to view participants for this event.");
            }

            var registrations = await _registrationRepository.GetByEventIdAsync(eventId);
            return registrations.Select(r => new ParticipantResponseDto
            {
                RegistrationId = r.Id,
                ParticipantId = r.ParticipantId,
                FullName = r.Participant?.FullName ?? "Unknown",
                Email = r.Participant?.Email ?? "Unknown",
                RegistrationDate = r.RegistrationDate,
                Status = r.Status
            });
        }

        private static RegistrationResponseDto MapToResponseDto(Registration reg)
        {
            return new RegistrationResponseDto
            {
                Id = reg.Id,
                EventId = reg.EventId,
                EventTitle = reg.Event?.Title ?? string.Empty,
                EventCategory = reg.Event?.Category ?? string.Empty,
                EventLocation = reg.Event?.Location ?? string.Empty,
                EventStartDate = reg.Event?.StartDate ?? DateTime.MinValue,
                EventEndDate = reg.Event?.EndDate ?? DateTime.MinValue,
                ParticipantId = reg.ParticipantId,
                ParticipantName = reg.Participant?.FullName ?? string.Empty,
                ParticipantEmail = reg.Participant?.Email ?? string.Empty,
                RegistrationDate = reg.RegistrationDate,
                Status = reg.Status
            };
        }
    }
}
