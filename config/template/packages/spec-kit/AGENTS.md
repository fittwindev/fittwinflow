# Agents
## size-recommender
- Inputs: { brand, garment_type, measurements, fit_preference }
- Output: { recommended_size, confidence, notes }
- Policy: prefer brand-specific charts; fallback to learned prior; include uncertainty band.
## measurement-validator
- Inputs: { front_photo_meta, side_photo_meta, lidar_present }
- Output: { accept:boolean, warnings:string[] }
- Policy: reject if distance < 1.5m or pose misaligned; warn on low light/occlusion.
