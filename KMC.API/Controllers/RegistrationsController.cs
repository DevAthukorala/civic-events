using System.Security.Claims;
using KMC.API.DTOs;
using KMC.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KMC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationsController : ControllerBase
    {
        private readonly IRegistrationService _registrationService;

        public RegistrationsController(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        [HttpPost]
        [Authorize(Roles = "Participant")]
        public async Task<ActionResult<RegistrationResponseDto>> RegisterForEvent([FromBody] CreateRegistrationDto dto)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _registrationService.RegisterAsync(dto.EventId, currentUserId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Participant")]
        public async Task<IActionResult> CancelRegistration(int id)
        {
            var currentUserId = GetCurrentUserId();
            await _registrationService.CancelRegistrationAsync(id, currentUserId);
            return NoContent();
        }

        [HttpGet("my")]
        [Authorize(Roles = "Participant")]
        public async Task<ActionResult<IEnumerable<RegistrationResponseDto>>> GetMyRegistrations()
        {
            var currentUserId = GetCurrentUserId();
            var registrations = await _registrationService.GetMyRegistrationsAsync(currentUserId);
            return Ok(registrations);
        }

        [HttpGet("/api/events/{id}/participants")]
        [Authorize(Roles = "Organizer")]
        public async Task<ActionResult<IEnumerable<ParticipantResponseDto>>> GetEventParticipants(int id)
        {
            var currentUserId = GetCurrentUserId();
            var participants = await _registrationService.GetEventParticipantsAsync(id, currentUserId);
            return Ok(participants);
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
