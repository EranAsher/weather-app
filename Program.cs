using Microsoft.Extensions.Caching.Memory;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Use the CORS policy in the middleware
app.UseCors("AllowAllOrigins");

var apiKey = "fa7ed20db0054efeb37210554242909";


app.MapPost("/api/echo", (string message) =>
{
    return Results.Ok(message);
});


app.MapGet("/weather/current", async (string city, IHttpClientFactory clientFactory, IMemoryCache cache) =>
{
    string cacheKey = $"weather-{city.ToLower()}";

    if (cache.TryGetValue(cacheKey, out WeatherApiResponse cachedWeather))
    {
        var cachedResult = new
        {
            cachedWeather.Location.name,
            cachedWeather.Location.country,
            cachedWeather.Current.temp_c,
            source = "cache"
        };

        return Results.Ok(cachedResult);
    }

    var requestUrl = $"http://api.weatherapi.com/v1/current.json?key={apiKey}&q={city}";

    Console.WriteLine($"Received request for city: {city}");
    var client = clientFactory.CreateClient();

    var response = await client.GetAsync(requestUrl);

    if (!response.IsSuccessStatusCode)
    {
        return Results.BadRequest("Unable to retrieve weather data");
    }

    // Parse the response
    var weatherData = await response.Content.ReadFromJsonAsync<WeatherApiResponse>();
    var responseContent = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseContent);

    var cacheEntryOptions = new MemoryCacheEntryOptions
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
    };
    cache.Set(cacheKey, weatherData, cacheEntryOptions);

    if (weatherData == null)
    {
        return Results.BadRequest("Invalid weather data format");
    }

    // Return the result in the required structure
    var result = new
    {
        weatherData.Location.name,
        weatherData.Location.country,
        weatherData.Current.temp_c,
        source = "api",
    };

    return Results.Ok(result);
});


app.MapGet("/weather/week", async (string city, string date, IHttpClientFactory clientFactory, IMemoryCache cache) =>
{
    DateTime inputDate = DateTime.Parse(date);
    DateTime weekStart = inputDate.AddDays(-(int)inputDate.DayOfWeek);
    DateTime weekEnd = weekStart.AddDays(6);

    var weatherPerWeek = new List<WeatherOutput>();

    for (DateTime day = weekStart; day <= weekEnd; day = day.AddDays(1))
    {
        string cacheKey = $"weather-{city.ToLower()}-{day:yyyy-MM-dd}";

        if (!cache.TryGetValue(cacheKey, out WeatherApiResponse cachedWeather))
        {
            var requestUrl = $"http://api.weatherapi.com/v1/history.json?key={apiKey}&q={city}&dt={day:yyyy-MM-dd}";
            var client = clientFactory.CreateClient();
            var response = await client.GetAsync(requestUrl);
            if (!response.IsSuccessStatusCode)
            {
                return Results.BadRequest($"Unable to retrieve weather data for {day:yyyy-MM-dd}");
            }

            cachedWeather = await response.Content.ReadFromJsonAsync<WeatherApiResponse>();

            var cacheEntryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            };
            cache.Set(cacheKey, cachedWeather, cacheEntryOptions);
        }

        var dailyWeather = new WeatherOutput();
        dailyWeather.date = cachedWeather.Forecast.Forecastday[0].date;
        dailyWeather.city = cachedWeather.Location.name;
        dailyWeather.country = cachedWeather.Location.country;
        dailyWeather.tempreture = cachedWeather.Forecast.Forecastday[0].Day.avgtemp_c;

        weatherPerWeek.Add(dailyWeather);
    }
    return Results.Ok(weatherPerWeek);
});

app.Run();

// Classes to represent the WeatherAPI response structure

public class WeatherOutput
{
    public string date { get; set; }
    public string city { get; set; }
    public string country { get; set; }
    public float tempreture { get; set; }
}

public class WeatherApiResponse
{
    public Location Location { get; set; }
    public Forecast Forecast { get; set; }
    public Current Current { get; set; }
}

public class Location
{
    public string name { get; set; }
    public string country { get; set; }
}

public class Current
{
    public float temp_c { get; set; }
}

public class Forecast
{
    public List<Forecastday> Forecastday { get; set; }
}

public class Forecastday
{
    public string date { get; set; }
    public Day Day { get; set; }
}

public class Day
{
    public float avgtemp_c { get; set; }
}




