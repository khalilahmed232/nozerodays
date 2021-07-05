package vo;

import java.sql.Date;

import lombok.Data;

public @Data class ChangeVO {
	private Long actGroupId;

	private String dateStr;
	private Date ceatedDate;
}
