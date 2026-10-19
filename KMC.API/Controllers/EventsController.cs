using System.Security.Claims;
using KMC.API.DTOs;
using KMC.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KMC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly ISearchService _searchService;

        public EventsController(IEventService eventService, ISearchService searchService)
        {
            _eventService = eventService;
            _searchService = searchService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<EventResponseDto>>> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<EventResponseDto>>> SearchEvents([FromQuery] EventSearchParamsDto paramsDto)
        {
            var events = await _searchService.SearchEventsAsync(paramsDto);
            return Ok(events);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<EventResponseDto>> GetEventById(int id)
        {
            var ev = await _eventService.GetEventByIdAsync(id);
            return Ok(ev);
        }

        [HttpGet("my")]
        [Authorize(Roles = "Organizer")]
        public async Task<ActionResult<IEnumerable<EventResponseDto>>> GetMyEvents()
        {
            var currentUserId = GetCurrentUserId();
            var events = await _eventService.GetMyEventsAsync(currentUserId);
            return Ok(events);
        }

        [HttpPost]
        [Authorize(Roles = "Organizer")]
        public async Task<ActionResult<EventResponseDto>> CreateEvent([FromBody] CreateEventDto dto)
        {
            var currentUserId = GetCurrentUserId();
            var createdEvent = await _eventService.CreateEventAsync(dto, currentUserId);
            return CreatedAtAction(nameof(GetEventById), new { id = createdEvent.Id }, createdEvent);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Organizer")]
        public async Task<ActionResult<EventResponseDto>> UpdateEvent(int id, [FromBody] UpdateEventDto dto)
        {
            var currentUserId = GetCurrentUserId();
            var updatedEvent = await _eventService.UpdateEventAsync(id, dto, currentUserId);
            return Ok(updatedEvent);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Organizer")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var currentUserId = GetCurrentUserId();
            await _eventService.DeleteEventAsync(id, currentUserId);
            return NoContent();
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("User identity claim missing or invalid.");
            }
            return userId;
        }
    }
}
