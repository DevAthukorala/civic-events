using KMC.API.Data;
using KMC.API.Models;
using Microsoft.EntityFrameworkCore;

namespace KMC.API.Repositories
{
    public interface IEventRepository : IRepository<Event>
    {
        Task<IEnumerable<Event>> GetAllWithDetailsAsync();
        Task<Event?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Event>> GetByOrganizerIdAsync(int organizerId);
        Task<IEnumerable<Event>> SearchEventsAsync(string? name, string? category, DateTime? date, string? location);
    }

    public class EventRepository : GenericRepository<Event>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Event>> GetAllWithDetailsAsync()
        {
            return await _dbSet
                .Include(e => e.Organizer)
                .Include(e => e.Registrations)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();
        }

        public async Task<Event?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(e => e.Organizer)
                .Include(e => e.Registrations)
                    .ThenInclude(r => r.Participant)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Event>> GetByOrganizerIdAsync(int organizerId)
        {
            return await _dbSet
                .Include(e => e.Organizer)
                .Include(e => e.Registrations)
                .Where(e => e.OrganizerId == organizerId)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Event>> SearchEventsAsync(string? name, string? category, DateTime? date, string? location)
        {
            var query = _dbSet
                .Include(e => e.Organizer)
                .Include(e => e.Registrations)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                var lowerName = name.Trim().ToLower();
                query = query.Where(e => e.Title.ToLower().Contains(lowerName) || e.Description.ToLower().Contains(lowerName));
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                var lowerCategory = category.Trim().ToLower();
                query = query.Where(e => e.Category.ToLower() == lowerCategory);
            }

            if (date.HasValue)
            {
                var searchDate = date.Value.Date;
                query = query.Where(e => e.StartDate.Date <= searchDate && e.EndDate.Date >= searchDate);
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                var lowerLoc = location.Trim().ToLower();
                query = query.Where(e => e.Location.ToLower().Contains(lowerLoc));
            }

            return await query.OrderBy(e => e.StartDate).ToListAsync();
        }
    }
}
