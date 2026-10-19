using KMC.API.DTOs;
using KMC.API.Models;
using KMC.API.Repositories;

namespace KMC.API.Services
{
    public interface IEventService
    {
        Task<IEnumerable<EventResponseDto>> GetAllEventsAsync();
        Task<EventResponseDto> GetEventByIdAsync(int id);
        Task<IEnumerable<EventResponseDto>> GetMyEventsAsync(int organizerId);
        Task<EventResponseDto> CreateEventAsync(CreateEventDto dto, int organizerId);
        Task<EventResponseDto> UpdateEventAsync(int id, UpdateEventDto dto, int organizerId);
        Task<bool> DeleteEventAsync(int id, int organizerId);
    }

    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IUserRepository _userRepository;

        public EventService(IEventRepository eventRepository, IUserRepository userRepository)
        {
            _eventRepository = eventRepository;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<EventResponseDto>> GetAllEventsAsync()
        {
            var events = await _eventRepository.GetAllWithDetailsAsync();
            return events.Select(MapToResponseDto);
        }

        public async Task<EventResponseDto> GetEventByIdAsync(int id)
        {
            var ev = await _eventRepository.GetByIdWithDetailsAsync(id);
            if (ev == null)
            {
                throw new KeyNotFoundException($"Event with Id {id} was not found.");
            }
            return MapToResponseDto(ev);
        }

        public async Task<IEnumerable<EventResponseDto>> GetMyEventsAsync(int organizerId)
        {
            var events = await _eventRepository.GetByOrganizerIdAsync(organizerId);
            return events.Select(MapToResponseDto);
        }

        public async Task<EventResponseDto> CreateEventAsync(CreateEventDto dto, int organizerId)
        {
            var organizer = await _userRepository.GetByIdAsync(organizerId);
            if (organizer == null || organizer.Role != "Organizer")
            {
                throw new UnauthorizedAccessException("Only users with the 'Organizer' role can create events.");
            }

            if (dto.EndDate < dto.StartDate)
            {
                throw new ArgumentException("End date cannot be earlier than Start date.");
            }

            var ev = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Location = dto.Location,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                MaxParticipants = dto.MaxParticipants,
                OrganizerId = organizerId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _eventRepository.AddAsync(ev);
            await _eventRepository.SaveChangesAsync();

            var createdEv = await _eventRepository.GetByIdWithDetailsAsync(ev.Id);
            return MapToResponseDto(createdEv!);
        }

        public async Task<EventResponseDto> UpdateEventAsync(int id, UpdateEventDto dto, int organizerId)
        {
            var ev = await _eventRepository.GetByIdWithDetailsAsync(id);
            if (ev == null)
            {
                throw new KeyNotFoundException($"Event with Id {id} was not found.");
            }

            if (ev.OrganizerId != organizerId)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this event because you are not the creator.");
            }

            if (dto.EndDate < dto.StartDate)
            {
                throw new ArgumentException("End date cannot be earlier than Start date.");
            }

            ev.Title = dto.Title;
            ev.Description = dto.Description;
            ev.Category = dto.Category;
            ev.Location = dto.Location;
            ev.StartDate = dto.StartDate;
            ev.EndDate = dto.EndDate;
            ev.MaxParticipants = dto.MaxParticipants;
            ev.UpdatedAt = DateTime.UtcNow;

            _eventRepository.Update(ev);
            await _eventRepository.SaveChangesAsync();

            var updatedEv = await _eventRepository.GetByIdWithDetailsAsync(id);
            return MapToResponseDto(updatedEv!);
        }

        public async Task<bool> DeleteEventAsync(int id, int organizerId)
        {
            var ev = await _eventRepository.GetByIdAsync(id);
            if (ev == null)
            {
                throw new KeyNotFoundException($"Event with Id {id} was not found.");
            }

            if (ev.OrganizerId != organizerId)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this event because you are not the creator.");
            }

            _eventRepository.Delete(ev);
            return await _eventRepository.SaveChangesAsync();
        }

        private static EventResponseDto MapToResponseDto(Event ev)
        {
            return new EventResponseDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Description = ev.Description,
                Category = ev.Category,
                Location = ev.Location,
                StartDate = ev.StartDate,
                EndDate = ev.EndDate,
                MaxParticipants = ev.MaxParticipants,
                RegisteredCount = ev.Registrations?.Count(r => r.Status == "Registered") ?? 0,
                OrganizerId = ev.OrganizerId,
                OrganizerName = ev.Organizer?.FullName ?? "Unknown Organizer",
                CreatedAt = ev.CreatedAt,
                UpdatedAt = ev.UpdatedAt
            };
        }
    }
}
