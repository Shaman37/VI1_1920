#version 420

uniform sampler2D water,sand,grass,rock,mountain,snow;

uniform	vec4 diffuse;
uniform	vec4 specular;
uniform	float shininess;
uniform float strength;
uniform float minValue;

in Data {
	vec3 normal;
	vec3 l_dir;
	vec4 eye;
	float elevation;
	vec2 texCoord;
} DataIn;

out vec4 colorOut;
 
void main() {
    // set the specular term to black
	vec4 spec = vec4(0.0);

	// normalize both input vectors
	vec3 n = normalize(DataIn.normal);
	vec3 e = normalize(vec3(DataIn.eye));
	vec3 l = DataIn.l_dir;
	
	float intensity = max(dot(n,l), 0.0);

	// if the vertex is lit compute the specular color
	if (intensity > 0.0) {
		// compute the half vector
		vec3 h = normalize(l + e);	
		// compute the specular intensity
		float intSpec = max(dot(h,n), 0.0);
		// compute the specular term into spec
		spec = specular * pow(intSpec,shininess);
	}
	
	vec4 colorWater = texture(water, DataIn.texCoord);
	vec4 colorSand = texture(sand, DataIn.texCoord);
	vec4 colorGrass = texture(grass, DataIn.texCoord);
	vec4 colorRock = texture(rock, DataIn.texCoord);
	vec4 colorMountain = texture(mountain, DataIn.texCoord);
	vec4 colorSnow = texture(snow, DataIn.texCoord);
	// colorOut = max(intensity *  diffuse + spec, diffuse * 0.25);
	
	// Water Texture Application
	if(DataIn.elevation == 0){
		colorOut = max(intensity * colorWater * diffuse + spec, colorWater * diffuse * 0.25);
	}
	// Water-Sand Transition
	else if(DataIn.elevation < 0.01){
		float color;
		color = smoothstep(0.0,0.01,DataIn.elevation);

		colorOut = max(intensity * mix(colorWater,colorSand,color) * diffuse + spec, mix(colorWater,colorSand,color) * diffuse * 0.25);
	}
	// Sand Texture Application
	else if(DataIn.elevation < 0.02){
		colorOut = max(intensity * colorSand * diffuse + spec, colorSand * diffuse * 0.25);
	}
	// Sand-Grass Transition
	else if(DataIn.elevation  < 0.03){
		float color;
		color = smoothstep(0.02,0.03,DataIn.elevation);

		colorOut = max(intensity * mix(colorSand,colorGrass,color) * diffuse + spec, mix(colorSand,colorGrass,color) * diffuse * 0.25);
	}
	// Grass Texture Application
	else if(DataIn.elevation < 0.6){
		colorOut = max(intensity * colorGrass * diffuse + spec, colorGrass * diffuse * 0.25);
	}
	// Grass-Rock Transition
	else if(DataIn.elevation  < 0.65){
		float color;
		color = smoothstep(0.6,0.65,DataIn.elevation);

		colorOut = max(intensity * mix(colorGrass,colorRock,color) * diffuse + spec, mix(colorGrass,colorRock,color) * diffuse * 0.25);
	}
	// Rock Texture Application
	else if(DataIn.elevation < 0.75){
		colorOut = max(intensity * colorRock * diffuse + spec, colorRock * diffuse * 0.25);
	}
	// Rock-Mountain Transition
	else if(DataIn.elevation  < 0.85){
		float color;
		color = smoothstep(0.75,0.85,DataIn.elevation);

		colorOut = max(intensity * mix(colorRock,colorMountain,color) * diffuse + spec, mix(colorRock,colorMountain,color) * diffuse * 0.25);
	}
	// Mountain Texture Application
	else if(DataIn.elevation < 0.90){
		colorOut = max(intensity * colorMountain * diffuse + spec, colorMountain * diffuse * 0.25);
	}
	// Mountain-Snow Transition
	else if(DataIn.elevation < 0.95){
		float color;
		color = smoothstep(0.9,0.95,DataIn.elevation);

		colorOut = max(intensity * mix(colorMountain,colorSnow,color) * diffuse + spec, mix(colorMountain,colorSnow,color) * diffuse * 0.25);
	}
	// Snow Texture Application
	else{
		colorOut = max(intensity * colorSnow * diffuse + spec, colorSnow * diffuse * 0.25);
	}
}