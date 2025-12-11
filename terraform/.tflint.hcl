# TFLint configuration for Three Horizons Accelerator

config {
  force = false
}

# Skip examples directory as these are documentation examples, not complete configurations
plugin "terraform" {
  enabled = true
  preset  = "recommended"
}
