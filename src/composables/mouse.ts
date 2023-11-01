import type { Directive } from "vue"

export interface MouseInteractionsOptions {
	click?(x: number, y: number): any;
	drag?(x: number, y: number): any;
	scroll?(up: boolean, x: number, y: number): any;
}

export function useMouseInteractions(options: MouseInteractionsOptions): Directive<HTMLElement> {
	return {
		created(el) {
			let mouseState: "up" | "down" | "drag" = "up";
			
			el.addEventListener("mousedown", (event: MouseEvent) => {
				mouseState = "down";
			});
	
			el.addEventListener("mouseup", function(event: MouseEvent) {
				if (mouseState == "down") {
					const x = event.x - el.offsetLeft;
					const y = event.y - el.offsetTop;
					options.click?.(x, y);
				}
				
				mouseState = "up";
			});
	
			el.addEventListener("mousemove", (event: MouseEvent) => {
				if (mouseState == "down" || mouseState == "drag") {
					options.drag?.(event.movementX, event.movementY);
					mouseState = "drag";
				}
			});
	
			el.addEventListener("wheel", (event: WheelEvent) => {
				const x = event.x - el.offsetLeft;
				const y = event.y - el.offsetTop;
				options.scroll?.(event.deltaY < 0, x, y);
			}, { passive: true });
		}
	};
}