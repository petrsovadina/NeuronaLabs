using System;
using HotChocolate;

namespace NeuronaLabs.GraphQL
{
    public class GraphQLErrorFilter : IErrorFilter
    {
        public IError OnError(IError error)
        {
            if (error.Exception is ArgumentException argEx)
            {
                return error.WithMessage(argEx.Message)
                    .WithCode("VALIDATION_ERROR");
            }

            if (error.Exception is UnauthorizedAccessException)
            {
                return error.WithMessage("Unauthorized access")
                    .WithCode("UNAUTHORIZED");
            }

            // Pro produkční prostředí nechceme zobrazovat detaily interních chyb
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
            {
                return error.WithMessage("An internal error has occurred.")
                    .WithCode("INTERNAL_ERROR");
            }

            return error;
        }
    }
}
