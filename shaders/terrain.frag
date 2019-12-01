#version 420
 
uniform	vec4 diffuse;
uniform	vec4 specular;
uniform	float shininess;
 
in Data {
	vec3 normal;
	vec3 l_dir;
	vec4 eye;
	float elevation;
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

	if(DataIn.elevation*15 == 0){
		colorOut = max(intensity *  diffuse + spec, diffuse * 0.25) + vec4(0,0,25,0);
	}
	else if(0<DataIn.elevation*15 && (DataIn.elevation*15)<0.95){
		colorOut = max(intensity *  diffuse + spec, diffuse * 0.25) + vec4(0,20,0,0);
	}
	else if(DataIn.elevation*15 > 0.95){
		colorOut = max(intensity *  diffuse + spec, diffuse * 0.25) + vec4(255,255,255,0);
	}
}