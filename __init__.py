DOMAIN = "beken"

def setup(hass, config):
  hass.states.set("beken.loaded", "yes")
  return True
