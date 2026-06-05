# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY das-backend/DoctorAppointmentSystem.sln ./das-backend/
COPY das-backend/src/DoctorAppointmentSystem.API/DoctorAppointmentSystem.API.csproj ./das-backend/src/DoctorAppointmentSystem.API/
COPY das-backend/src/DoctorAppointmentSystem.Application/DoctorAppointmentSystem.Application.csproj ./das-backend/src/DoctorAppointmentSystem.Application/
COPY das-backend/src/DoctorAppointmentSystem.Domain/DoctorAppointmentSystem.Domain.csproj ./das-backend/src/DoctorAppointmentSystem.Domain/
COPY das-backend/src/DoctorAppointmentSystem.Infrastructure/DoctorAppointmentSystem.Infrastructure.csproj ./das-backend/src/DoctorAppointmentSystem.Infrastructure/

RUN dotnet restore ./das-backend/DoctorAppointmentSystem.sln

COPY das-backend/ ./das-backend/

WORKDIR /src/das-backend
RUN dotnet publish ./src/DoctorAppointmentSystem.API/DoctorAppointmentSystem.API.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 10000

COPY --from=build /app/publish .

ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-10000} dotnet DoctorAppointmentSystem.API.dll"]
