package io.github.cs3200.izaakyiwen.b3;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController {

    @RequestMapping("/*")
    public String index() {
        return "/html/index.html";
    }

    @RequestMapping("/event/*")
    public String event() {
        return "/html/index.html";
    }
}
