<?php

if (!function_exists('flashMessage')) {
    function flashMessage($message, $type = "info")
    {
        session()->flash('flash.type', $type);
        session()->flash('flash.message', $message);
    }
}
