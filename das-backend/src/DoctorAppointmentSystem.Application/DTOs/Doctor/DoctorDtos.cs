namespace DoctorAppointmentSystem.Application.DTOs.Doctor;

/// <summary>Full doctor profile returned to the client.</summary>
public class DoctorProfileDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public Guid DepartmentId { get; set; }
    public string Qualifications { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public bool IsApproved { get; set; }
}

/// <summary>Compact card used in search results and lists.</summary>
public class DoctorSummaryDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string Qualifications { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
}

/// <summary>Payload for updating the doctor's own profile.</summary>
public class UpdateDoctorProfileDto
{
    public string PhoneNumber { get; set; } = string.Empty;
    public Guid DepartmentId { get; set; }
    public string Qualifications { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
}

/// <summary>Query parameters for searching doctors.</summary>
public class DoctorSearchDto
{
    public string? Name { get; set; }
    public Guid? DepartmentId { get; set; }
}
