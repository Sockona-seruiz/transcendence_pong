export function resetParams(ball_s, paddles_s, x)
{
	ball_s.ball.position.x = 0;
	ball_s.ball.position.z = 0;
	ball_s.ball_outline.position.x = 0;
	ball_s.ball_outline.position.z = 0;
	ball_s.trainee_msh[0].material.color.setHex(0xffffff);
	ball_s.ball_outline.material.color.setHex(0xffffff);
	ball_s.light.color.setHex(0xffffff);
	ball_s.pos_history_x.unshift(0);
	ball_s.pos_history_z.unshift(0);
	ball_s.pos_history_x.pop();
	ball_s.pos_history_z.pop();
	paddles_s.bar_left.position.x = paddles_s.Lbar_pos_x;
	paddles_s.bar_left.position.z = 0;
	paddles_s.bar_left_out.position.x = paddles_s.bar_left.position.x;
	paddles_s.bar_left_out.position.z = paddles_s.bar_left.position.z;
	paddles_s.bar_right.position.x = paddles_s.Rbar_pos_x;
	paddles_s.bar_right.position.z = 0;
	paddles_s.bar_right_out.position.x = paddles_s.bar_right.position.x;
	paddles_s.bar_right_out.position.z = paddles_s.bar_right.position.z;
	if (x == 0)
		ball_s.BallAngle = Math.PI;
	else
		ball_s.BallAngle = Math.PI * 2;
	ball_s.Speed = ball_s.BaseSpeed;
	ball_s.LeftHit = 0;
	ball_s.RightHit = 0;
}