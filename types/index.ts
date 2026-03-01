export interface Country {
  id:   number
  name: string
  slug: string
  code: string
}

export interface Region {
  id:         number
  name:       string
  slug:       string
  country_id: number
}

export interface Category {
  id:    number
  name:  string
  slug:  string
  icon:  string
  color: string
}

export interface Location {
  id:                number
  name:              string
  slug:              string
  description:       string | null
  short_description: string | null
  category_slug:     string
  category_name:     string
  category_color:    string
  country_slug:      string
  region_name:       string | null
  lat:               number
  lng:               number
  distance_km?:      number
  is_featured:       boolean
  is_premium:        boolean
  image_url:         string | null
  best_season:       string | null
  permit_required:   boolean
  permit_info:       string | null
  meta_title:        string | null
  meta_description:  string | null
}

export interface MapLocation extends Location {
  lat_out?: number
  lng_out?: number
  country_slug_out?: string
}
