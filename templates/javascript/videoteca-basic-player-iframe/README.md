# Videoteca Basic Iframe Player

This template launches a basic application which delivers a player from [Videoteca](https://videofront.com.br/videoteca), using iframe.

# Before using this template
In order to use this template, you must:

**1. Allow the usage of iframe players in your Videoteca account**
**2. Setup the Videoteca data for this template**

It can be done by setting the following [Environment Variable](https://www.azion.com/en/documentation/products/edge-functions/environment-variables/).
- `VIDEOTECA_USER=myuser`
- `VIDEOTECA_TOKEN=HMAC-SHA512-XYZ`

Or via JSON Args:
```json
{
 "videoteca_user": "myuser",
 "videoteca_token": "HMAC-SHA512-XYZ"
}
```

Note: the video to be loaded is defined though the query argument "video-id". For example:
```
domain.map.azionedge.net/?video-id=1234_ABCD
```
