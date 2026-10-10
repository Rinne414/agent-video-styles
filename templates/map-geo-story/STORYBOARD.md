# Storyboard: The Silk Road in 30 seconds

Style `map-geo-story` (experimental), Remotion, 1920x1080 @ 30 fps, 900 frames, silent, dark theme, highlight amber `#F59E0B`.
Proportions come from the style's 45 s structure scaled by 2/3, then adjusted so each annotation stays readable for 2.5 s or more.

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 Establish | 0-100 | Kicker "TRADE ROUTES OF EURASIA, C. 130 BCE - 1450S CE", title "The Silk Road in 30 seconds", source line | Eurasia view (Mercator, scale 700), faint graticule, title rises in at 6-30, dashed planned route fades in 40-70, 1.5% slow drift | none (silent) |
| 2 Zoom in | 100-190 | - | Camera eases (inOut cubic) to western China; China fills amber 150-165 | none |
| 3 Beat 1 | 190-390 | Chang'an label, annotation "Silk leaves Chang'an: Han and Tang capital, today's Xi'an: the road's eastern end" (205-305), Kashgar, Samarkand labels | Route Chang'an > Dunhuang > Kashgar > Samarkand draws 200-310 with head marker; dots spring in as the tip passes; Uzbekistan fills 312; ping at Samarkand; annotation "Sogdian relay: silk goes west; paper-making follows after 751 CE" (322-440); camera pans west 320-390 | none |
| 4 Beat 2 | 390-580 | Baghdad label, annotation "Abbasid hub: capital from 762; paper mill by 794; spices and textiles" (495-600) | Route Samarkand > Merv > Baghdad draws 395-490; Iraq fills 492; China and Uzbekistan dim to 40%; camera pans to Anatolia 510-580 | none |
| 5 Beat 3 | 580-750 | Constantinople label, annotation "Western end: silkworm eggs smuggled in c. 552 CE: Byzantine silk" (690-770) | Route Baghdad > Aleppo > Constantinople draws 585-685; Turkey fills 685; ping at Constantinople | none |
| 6 Zoom out | 750-815 | - | Camera eases out to the full route (scale 950); all four regions settle at 60% | none |
| 7 Outro | 815-900 | "Not one road, but a relay of traders: goods moved 6,000+ km, hand to hand." + source line | Takeaway panel rises 815-845 (settled by 845), held 55 frames (1.8 s) | none |

Facts used (all stated as approximate or traditional where the sources differ):

- Silk Road trade opened c. 130 BCE (Zhang Qian's missions) and faded after the 1450s as sea routes and the Ottoman takeover of Constantinople (1453) reshaped trade.
- Chang'an (today's Xi'an) was the capital of the Han and Tang dynasties.
- Samarkand was the hub of the Sogdian merchants; paper-making is traditionally said to have reached it after the Battle of Talas (751 CE).
- Baghdad was founded in 762 as the Abbasid capital; its first paper mill is dated to 794.
- Silkworm eggs reached Constantinople c. 552 CE under Justinian, starting Byzantine silk production.
- Straight-line distance Chang'an to Constantinople is about 6,800 km (computed with d3-geo `geoDistance`).
