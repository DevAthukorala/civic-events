using System.ComponentModel.DataAnnotations;

namespace KMC.API.DTOs
{
    public class CreateRegistrationDto
    {
        [Required]
        public int EventId { get; set; }
    }

    public class RegistrationResponseDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string EventTitle { get; set; } = string.Empty;
        public string EventCategory { get; set; } = string.Empty;
        public string EventLocation { get; set; } = string.Empty;
        public DateTime EventStartDate { get; set; }
        public DateTime EventEndDate { get; set; }
        public int ParticipantId { get; set; }
        public string ParticipantName { get; set; } = string.Empty;
        public string ParticipantEmail { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class ParticipantResponseDto
    {
        public int RegistrationId { get; set; }
        public int ParticipantId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
