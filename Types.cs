using HotChocolate;

public class Patient
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
    public string LastDiagnosis { get; set; }
}

public class DiagnosticData
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string DiagnosisType { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
}

public class DicomStudy
{
    public string StudyInstanceUid { get; set; }
    public int PatientId { get; set; }
    public string Modality { get; set; }
    public DateTime StudyDate { get; set; }
}

