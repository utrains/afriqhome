-- Update the location column to JSONB type
ALTER TABLE properties
ALTER COLUMN location TYPE JSONB USING jsonb_build_object(
  'country', location,
  'city', '',
  'address', '',
  'landmark', ''
);

-- Add a constraint to ensure location has the required structure
ALTER TABLE properties
ADD CONSTRAINT location_structure_check
CHECK (
  jsonb_typeof(location) = 'object' AND
  location ? 'country' AND
  location ? 'city' AND
  location ? 'address' AND
  location ? 'landmark'
); 