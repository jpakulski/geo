# Geo

A tiny Rails app which uses the [Geocoder](https://github.com/alexreisner/geocoder) gem to geocode addresses in the supplied CSV file.

![Application screenshot](/screenshot_geo.jpg)

## Why?

A colleague had to geocode a lot of addresses. This would be an ongoing requirement.

## Install

```
gem install bundler

Clone this repository
cd into the cloned repository
bundle install
rails s
```

## Use

1. Drag-drop your csv file onto the browser window running the application.
2. The file must include: 'Address', 'Latitude' and 'Longitude' columns (amongst others).
3. A progress bar will show the number of rows geocoded.
4. Once the process finishes a file called **geocoded.csv** will be downloaded, containing your original columns with the longitude and latitude filled in.
5. You can download previous results by clicking the big red button.

## Background Photo

That's a photo showing the [Tauranga](https://goo.gl/maps/oPTfytTSwTK2) waterfront.
