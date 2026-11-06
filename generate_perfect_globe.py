import urllib.request
import json
import math

print("Downloading Natural Earth land GeoJSON for perfect coastlines...")
url = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.geojson'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
raw = urllib.request.urlopen(req, timeout=15).read()
geojson = json.loads(raw)

polygons = []
for feat in geojson['features']:
    geom = feat['geometry']
    coords = geom['coordinates']
    if geom['type'] == 'Polygon':
        polygons.append(coords[0])
    elif geom['type'] == 'MultiPolygon':
        for poly in coords:
            polygons.append(poly[0])

def point_in_poly(x, y, poly):
    inside = False
    n = len(poly)
    p1x, p1y = poly[0]
    for i in range(1, n + 1):
        p2x, p2y = poly[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside

def is_land(lon, lat):
    for poly in polygons:
        if point_in_poly(lon, lat, poly):
            return True
    return False

globe_points = []

# 1. Sample Coastline Perimeter Dots (Exact continent boundaries like United Carriers)
for poly in polygons:
    n = len(poly)
    for i in range(n):
        p1 = poly[i]
        p2 = poly[(i + 1) % n]
        
        # Distance between vertices
        dist = math.hypot(p2[0] - p1[0], p2[1] - p1[1])
        steps = max(1, int(dist / 1.5))
        for s in range(steps):
            frac = s / steps
            lon = p1[0] + (p2[0] - p1[0]) * frac
            lat = p1[1] + (p2[1] - p1[1]) * frac
            
            # Check Mozambique
            is_moz = (-26.9 <= lat <= -10.2) and (30.0 <= lon <= 41.2)
            globe_points.append({
                'lat': round(lat, 2),
                'lon': round(lon, 2),
                'moz': is_moz,
                'coast': True # Perimeter dot (drawn slightly brighter)
            })

print(f"Perimeter coastline dots: {len(globe_points)}")

# 2. Sample Interior Land Dots (Uniform grid)
for lat_i in range(-70, 78, 2):
    lat = float(lat_i)
    cos_lat = math.cos(math.radians(lat))
    if cos_lat < 0.1:
        continue
    lon_step = max(2.0, 2.2 / cos_lat)
    lon = -180.0
    while lon < 180.0:
        if is_land(lon, lat):
            is_moz = (-26.9 <= lat <= -10.2) and (30.0 <= lon <= 41.2)
            globe_points.append({
                'lat': round(lat, 2),
                'lon': round(lon, 2),
                'moz': is_moz,
                'coast': False
            })
        lon += lon_step

print(f"Total points with interior: {len(globe_points)}")

# 3. Clean Mozambique Points (Clean spacing without overlapping blobs)
for m_lat_i in range(-268, -100, 14):
    m_lat = m_lat_i / 10.0
    for m_lon_i in range(300, 415, 14):
        m_lon = m_lon_i / 10.0
        if is_land(m_lon, m_lat):
            globe_points.append({
                'lat': round(m_lat, 2),
                'lon': round(m_lon, 2),
                'moz': True,
                'coast': True
            })

print(f"Final clean points: {len(globe_points)}")

with open('frontend/src/data/worldPoints.json', 'w') as f:
    json.dump(globe_points, f, separators=(',', ':'))

print('Saved to frontend/src/data/worldPoints.json')


