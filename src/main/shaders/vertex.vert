
precision mediump float;

attribute vec3 attr_position;


uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mModel;

void main(void) {

  gl_Position = mProj * mView * mModel * mWorld * vec4(attr_position, 1.0);
  
}