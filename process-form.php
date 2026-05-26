<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed.';
    exit;
}

function field(string $key): string {
    return trim((string)($_POST[$key] ?? ''));
}

function clean_header_value(string $value): string {
    return str_replace(["\r", "\n"], '', $value);
}

if (field('website') !== '') {
    header('Location: contact.html?sent=1');
    exit;
}

$name = field('name');
$email = field('email');
$company = field('company');
$service = field('service_interest');
$budget = field('budget_range');
$details = field('project_details');

if ($name === '' || $email === '' || $service === '' || $budget === '' || $details === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: contact.html?sent=0');
    exit;
}

$to = 'support@systemcapitalmedia.com';
$subject = 'New project enquiry from systemcapitalmedia.com';
$safeName = clean_header_value($name);
$safeEmail = clean_header_value($email);
$message = "New project enquiry\n\n";
$message .= "Name: {$name}\n";
$message .= "Email: {$email}\n";
$message .= "Company: {$company}\n";
$message .= "Service interest: {$service}\n";
$message .= "Budget range: {$budget}\n\n";
$message .= "Project details:\n{$details}\n";

$headers = [
    'From: System Capital Website <support@systemcapitalmedia.com>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($to, $subject, $message, implode("\r\n", $headers));

header('Location: contact.html?sent=' . ($sent ? '1' : '0'));
exit;
