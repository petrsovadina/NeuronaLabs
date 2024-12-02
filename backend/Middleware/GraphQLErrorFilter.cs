using HotChocolate;

namespace NeuronaLabs.Middleware;

public class GraphQLErrorFilter : IErrorFilter
{
    private readonly ILogger<GraphQLErrorFilter> _logger;

    public GraphQLErrorFilter(ILogger<GraphQLErrorFilter> logger)
    {
        _logger = logger;
    }

    public IError OnError(IError error)
    {
        // Logování chyb
        _logger.LogError(
            "GraphQL Error: {ErrorMessage}\nException: {Exception}\nPath: {Path}", 
            error.Message, 
            error.Exception?.ToString() ?? "N/A", 
            error.Path
        );

        // Rozlišení typů chyb
        return error.Exception switch
        {
            UnauthorizedAccessException => error.WithMessage("Nemáte oprávnění k provedení této akce."),
            KeyNotFoundException => error.WithMessage("Požadovaný záznam nebyl nalezen."),
            ValidationException validationEx => 
                error.WithMessage(string.Join(", ", validationEx.Errors.Select(e => e.ErrorMessage))),
            _ => error.WithMessage("Nastala neočekávaná chyba. Kontaktujte podporu.")
        };
    }
}
