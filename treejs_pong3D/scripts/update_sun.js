export function moveSun(SunMesh, IncreaseBrightness)
{
	if (SunMesh)
	{
		console.log("wesh");
		SunMesh.traverse( function ( child ) {
			if ( child.isMesh )
			{
				if (IncreaseBrightness == true)
				{
					child.material.emissiveIntensity += 0.002;
					if (child.material.emissiveIntensity >= 0.75)
						IncreaseBrightness = false;
				}
				else
				{
					child.material.emissiveIntensity -= 0.002;
					if (child.material.emissiveIntensity <= 0.25)
						IncreaseBrightness = true;
				}
		}
	} );
	return (IncreaseBrightness);
	}
	else
		console.log("test");
}