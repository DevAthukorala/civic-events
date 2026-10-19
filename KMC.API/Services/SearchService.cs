using KMC.API.DTOs;
using KMC.API.Repositories;

namespace KMC.API.Services
{
    public interface ISearchService
    {
        Task<IEnumerable<EventResponseDto>> SearchEventsAsync(EventSearchParamsDto paramsDto);
    }

    public class SearchService : ISearchService
    {
        private readonly IEventRepository _eventRepository;

        public SearchService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<IEnumerable<EventResponseDto>> SearchEventsAsync(EventSearchParamsDto paramsDto)
        {
            var events = await _eventRepository.SearchEventsAsync(
                paramsDto.Name,
                paramsDto.Category,
                paramsDto.Date,
                paramsDto.Location);

            return events.Select(ev => new EventResponseDto
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
            });
        }
    }
}
