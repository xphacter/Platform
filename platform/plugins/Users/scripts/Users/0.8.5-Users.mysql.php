ALTER TABLE `{$prefix}total`
MODIFY `weightTotal` decimal(10,4) NOT NULL DEFAULT '0.0000';

ALTER TABLE `{$prefix}vote`
MODIFY `value` decimal(10,4) NOT NULL,
MODIFY `weight` decimal(10,4) NOT NULL DEFAULT '1.0000';

ALTER TABLE `{$prefix}vote`
MODIFY `value` decimal(10,4) NOT NULL,
MODIFY `weight` decimal(10,4) NOT NULL DEFAULT '1.0000';