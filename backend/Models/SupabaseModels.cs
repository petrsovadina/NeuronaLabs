using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuronaLabs.Models
{
    [Table("doctors")]
    public class Doctor
    {
        [Key]
        public Guid Id { get; set; }

        [Column("first_name")]
        public string FirstName { get; set; }

        [Column("last_name")]
        public string LastName { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("phone")]
        public string PhoneNumber { get; set; }

        [Column("specialization")]
        public string Specialization { get; set; }
    }
}
