using KMC.API.Data;
using KMC.API.Models;
using Microsoft.EntityFrameworkCore;

namespace KMC.API.Repositories
{
    public interface IRegistrationRepository : IRepository<Registration>
    {
        Task<Registration?> GetByParticipantAndEventAsync(int participantId, int eventId);
        Task<IEnumerable<Registration>> GetByParticipantIdAsync(int participantId);
        Task<IEnumerable<Registration>> GetByEventIdAsync(int eventId);
        Task<int> GetActiveCountForEventAsync(int eventId);
    }

    public class RegistrationRepository : GenericRepository<Registration>, IRegistrationRepository
    {
        public RegistrationRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Registration?> GetByParticipantAndEventAsync(int participantId, int eventId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(r => r.ParticipantId == participantId && r.EventId == eventId);
        }

        public async Task<IEnumerable<Registration>> GetByParticipantIdAsync(int participantId)
        {
            return await _dbSet
                .Include(r => r.Event)
                    .ThenInclude(e => e!.Organizer)
                .Where(r => r.ParticipantId == participantId)
                .OrderByDescending(r => r.RegistrationDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Registration>> GetByEventIdAsync(int eventId)
        {
            return await _dbSet
                .Include(r => r.Participant)
                .Where(r => r.EventId == eventId)
                .OrderByDescending(r => r.RegistrationDate)
                .ToListAsync();
        }

        public async Task<int> GetActiveCountForEventAsync(int eventId)
        {
            return await _dbSet
                .CountAsync(r => r.EventId == eventId && r.Status == "Registered");
        }
    }
}
